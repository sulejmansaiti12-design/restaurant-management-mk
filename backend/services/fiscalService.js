const moment = require('moment-timezone');
const db = require('../models');

class FiscalService {
  constructor() {
    this.timezone = 'Europe/Skopje';
    this.prefix = process.env.FISCAL_PREFIX || 'FIS';
  }

  /**
   * Generate fiscal number in format: FIS-YYYYMMDD-NNNNN
   */
  async generateFiscalNumber() {
    const date = moment().tz(this.timezone);
    const dateStr = date.format('YYYYMMDD');
    
    // Get today's count
    const todayStart = date.clone().startOf('day').toDate();
    const todayEnd = date.clone().endOf('day').toDate();

    const count = await db.FiscalReceipt.count({
      where: {
        receiptDate: {
          [db.Sequelize.Op.between]: [todayStart, todayEnd]
        }
      }
    });

    const sequence = String(count + 1).padStart(5, '0');
    return `${this.prefix}-${dateStr}-${sequence}`;
  }

  /**
   * Validate fiscal number format
   */
  validateFiscalNumber(fiscalNumber) {
    const pattern = /^[A-Z]{3}-\d{8}-\d{5}$/;
    return pattern.test(fiscalNumber);
  }

  /**
   * Calculate tax breakdown from order items
   */
  calculateTaxBreakdown(orderItems) {
    const breakdown = {};

    orderItems.forEach(item => {
      const rate = parseFloat(item.taxRate);
      
      if (!breakdown[rate]) {
        breakdown[rate] = {
          items: 0,
          subtotal: 0,
          tax: 0
        };
      }

      breakdown[rate].items += item.quantity;
      breakdown[rate].subtotal += parseFloat(item.subtotal);
      breakdown[rate].tax += parseFloat(item.taxAmount);
    });

    // Round values
    Object.keys(breakdown).forEach(rate => {
      breakdown[rate].subtotal = parseFloat(breakdown[rate].subtotal.toFixed(2));
      breakdown[rate].tax = parseFloat(breakdown[rate].tax.toFixed(2));
    });

    return breakdown;
  }

  /**
   * Create fiscal receipt for order
   */
  async createFiscalReceipt(order, orderItems) {
    try {
      const fiscalNumber = await this.generateFiscalNumber();
      const taxBreakdown = this.calculateTaxBreakdown(orderItems);

      const receiptData = {
        orderNumber: order.orderNumber,
        fiscalNumber,
        date: moment().tz(this.timezone).toISOString(),
        items: orderItems.map(item => ({
          name: item.menuItem ? item.menuItem.name : 'Unknown',
          quantity: item.quantity,
          unitPrice: parseFloat(item.unitPrice),
          taxRate: parseFloat(item.taxRate),
          subtotal: parseFloat(item.subtotal),
          tax: parseFloat(item.taxAmount),
          total: parseFloat(item.total)
        })),
        subtotal: parseFloat(order.subtotal),
        totalTax: parseFloat(order.totalTax),
        total: parseFloat(order.total),
        taxBreakdown,
        paymentMethod: order.payment ? order.payment.paymentMethod : 'unknown',
        companyInfo: {
          name: process.env.COMPANY_NAME || 'Restaurant',
          vatId: process.env.COMPANY_VAT_ID || '',
          address: process.env.COMPANY_ADDRESS || ''
        }
      };

      const receipt = await db.FiscalReceipt.create({
        orderId: order.id,
        fiscalNumber,
        receiptDate: new Date(),
        totalAmount: order.total,
        taxAmount: order.totalTax,
        taxBreakdown,
        receiptData,
        status: 'issued'
      });

      // Update order with fiscal number
      await order.update({ fiscalNumber });

      return receipt;
    } catch (error) {
      console.error('Error creating fiscal receipt:', error);
      throw error;
    }
  }

  /**
   * Generate fiscal report for date range
   */
  async generateFiscalReport(startDate, endDate) {
    const receipts = await db.FiscalReceipt.findAll({
      where: {
        receiptDate: {
          [db.Sequelize.Op.between]: [startDate, endDate]
        },
        status: 'issued'
      },
      include: [{
        model: db.Order,
        as: 'order'
      }],
      order: [['receiptDate', 'ASC']]
    });

    const report = {
      period: {
        from: moment(startDate).format('YYYY-MM-DD'),
        to: moment(endDate).format('YYYY-MM-DD')
      },
      totalReceipts: receipts.length,
      totalRevenue: 0,
      totalTax: 0,
      taxBreakdown: {},
      receipts: receipts.map(r => ({
        fiscalNumber: r.fiscalNumber,
        date: r.receiptDate,
        amount: parseFloat(r.totalAmount),
        tax: parseFloat(r.taxAmount)
      }))
    };

    receipts.forEach(receipt => {
      report.totalRevenue += parseFloat(receipt.totalAmount);
      report.totalTax += parseFloat(receipt.taxAmount);

      // Aggregate tax breakdown
      if (receipt.taxBreakdown) {
        Object.keys(receipt.taxBreakdown).forEach(rate => {
          if (!report.taxBreakdown[rate]) {
            report.taxBreakdown[rate] = {
              subtotal: 0,
              tax: 0
            };
          }
          report.taxBreakdown[rate].subtotal += receipt.taxBreakdown[rate].subtotal;
          report.taxBreakdown[rate].tax += receipt.taxBreakdown[rate].tax;
        });
      }
    });

    // Round totals
    report.totalRevenue = parseFloat(report.totalRevenue.toFixed(2));
    report.totalTax = parseFloat(report.totalTax.toFixed(2));

    Object.keys(report.taxBreakdown).forEach(rate => {
      report.taxBreakdown[rate].subtotal = parseFloat(report.taxBreakdown[rate].subtotal.toFixed(2));
      report.taxBreakdown[rate].tax = parseFloat(report.taxBreakdown[rate].tax.toFixed(2));
    });

    return report;
  }
}

module.exports = new FiscalService();
