/*=========================================================================================
REQUIRED MODULES
=========================================================================================*/

const mongoose = require("mongoose");
const moment = require("moment-timezone");

/*=========================================================================================
VARIABLES
=========================================================================================*/

const Schema = mongoose.Schema;

/*=========================================================================================
MODELS
=========================================================================================*/

const Account = require("./Account.js");

/*=========================================================================================
SUB MODELS MODEL
=========================================================================================*/

const TicketSchema = new Schema({
  id: { type: Schema.Types.ObjectId, required: true },
  amount: { type: Number, required: true }
});

const UsageSchema = new Schema({
  id: { type: Schema.Types.ObjectId, required: true },
  amount: { type: Number, required: true }
});

/*=========================================================================================
TRANSACTION MODEL
=========================================================================================*/

const TransactionSchema = new Schema({
  service: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String, default: "active" },
  entity: {
    sender: { type: Schema.Types.ObjectId, required: true },
    receiver: { type: Schema.Types.ObjectId, required: true }
  },
  date: {
    created: { type: String, required: true },
    modified: { type: String, required: true }
  },
  tickets: { type: [TicketSchema], default: [] },
  usages: { type: [UsageSchema], default: [] },
  amount: { type: Number, required: true },
  metadata: { type: Schema.Types.Mixed, default: {} }
});

/*=========================================================================================
MIDDLEWARE
=========================================================================================*/

TransactionSchema.pre("save", async function (next) {
  this.date.modified = moment().tz("Pacific/Auckland").format();
  return next();
});

/*=========================================================================================
STATICS
=========================================================================================*/

// @FUNC  fetchBalance
// @TYPE  STATIC - PROMISE - ASYNC
// @DESC  Fetch the balance of the associated account ID
TransactionSchema.statics.fetchBalance = function (accountId) {
  return new Promise(async (resolve, reject) => {
    // DECLARE AND INITIALISE VARIABLE
    const query1 = { service: "deposit", type: "bankTransfer", "entity.sender": accountId };
    const query2 = { service: "bonus", type: "bankTransfer", "entity.receiver": accountId };
    const query3 = { service: "payment", type: "checkout", "entity.sender": accountId };
    let bankTransferDeposits, bankTransferBonuses, checkoutPayments;
    const promises = [this.find(query1), this.find(query2), this.find(query3)];
    try {
      [bankTransferDeposits, bankTransferBonuses, checkoutPayments] = await Promise.all(promises);
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    // CALCULATE BALANCE
    let balance = { bankTransfer: 0, bankTransferBonus: 0, checkout: 0 };
    // bank transfer
    for (let i = 0; i < bankTransferDeposits.length; i++) {
      const bankTransferDeposit = bankTransferDeposits[i];
      balance.bankTransfer += bankTransferDeposit.remainingBalance();
    }
    // bank transfer bonus
    for (let i = 0; i < bankTransferBonuses.length; i++) {
      const bankTransferBonus = bankTransferBonuses[i];
      balance.bankTransferBonus += bankTransferBonus.remainingBalance();
    }
    // checkout
    for (let i = 0; i < checkoutPayments.length; i++) {
      const checkoutPayment = checkoutPayments[i];
      balance.checkout += checkoutPayment.remainingAmount();
    }
    // SUCCESS HANDLER
    resolve(balance);
  })
}

/* ----------------------------------------------------------------------------------------
DEPOSIT
---------------------------------------------------------------------------------------- */

// @FUNC  bankTransfer
// @TYPE  STATIC - PROMISE - ASYNC
// @DESC  
TransactionSchema.statics.bankTransfer = function (customerId, amountOne) {
  return new Promise(async (resolve, reject) => {
    // DECLARE VARIABLES
    const currentDate = moment().tz("Pacific/Auckland").format();
    const date = { created: currentDate, modified: currentDate };
    // get admin account
    const adminEmail = "carlvelasco96@gmail.com"; // TEMPORARY
    let admin;
    try {
      admin = Account.findOne({ type: "admin", email: adminEmail });
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    // CREATE THE BANK TRANSFER TICKET
    const serviceOne = "deposit";
    const typeOne = "bankTransfer";
    const entityOne = { sender: customerId, receiver: admin._id };
    // create the bank transfer instance
    let bankTransfer = new this({
      service: serviceOne, type: typeOne,
      entity: entityOne, date, amount: amountOne
    });
    // CREATE THE BONUS TICKET
    const bonusRate = 20; // $1 per $20 dollars deposit
    const serviceTwo = "bonus";
    const typeTwo = "bankTransfer";
    const entityTwo = { sender: admin._id, receiver: customerId };
    const amountTwo = Math.floor(amountOne / bonusRate);
    // create the bonus bank transfer instance
    let bonus = new this({
      service: serviceTwo, type: typeTwo,
      entity: entityTwo, date, amount: amountTwo
    });
    // ADD METADATA
    // bank transfer
    let metadataOne = { bonus: bonus._id };
    bankTransfer.metadata = metadataOne;
    // bonus
    let metadataTwo = { bankTransfer: bankTransfer._id };
    bonus.metadata = metadataTwo;
    // SAVE INSTANCES
    const promises = [bankTransfer.save(), bonus.save()];
    try {
      await Promise.all(promises);
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    // SUCCESS HANDLER
    return resolve([bankTransfer, bonus]);
  });
}

// @FUNC  onlinePayment
// @TYPE  STATIC - PROMISE - ASYNC
// @DESC  
TransactionSchema.statics.onlinePayment = function (sender, amount) {
  return new Promise(async (resolve, reject) => {
    // CREATE THE ONLINE PAYMENT TICKET
    // service
    const service = "deposit";
    // type
    const type = "onlinePayment";
    // entity
    const adminEmail = "carlvelasco96@gmail.com"; // TEMPORARY
    let admin;
    try {
      admin = Account.findOne({ type: "admin", email: adminEmail });
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    const entity = { sender, receiver: admin._id };
    // date
    const currentDate = moment().tz("Pacific/Auckland").format();
    const date = { created: currentDate, modified: currentDate };
    // metadata
    const metadata = {};
    // create instance
    let onlinePayment = new this({ service, type, entity, date, amount, metadata });
    // save instance
    try {
      await onlinePayment.save();
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    // SUCCESS HANDLER
    return resolve(onlinePayment);
  });
}

/* ----------------------------------------------------------------------------------------
PAYMENT
---------------------------------------------------------------------------------------- */

// @FUNC  checkout
// @TYPE  STATIC - PROMISE - ASYNC
// @DESC  
TransactionSchema.statics.checkout = function (orderId, sender, amount) {
  return new Promise(async (resolve, reject) => {
    // CREATE THE ONLINE PAYMENT TICKET
    // service
    const service = "payment";
    // type
    const type = "checkout";
    // entity
    const adminEmail = "carlvelasco96@gmail.com"; // TEMPORARY
    let admin;
    try {
      admin = await Account.findOne({ type: "admin", email: adminEmail });
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    const entity = { sender, receiver: admin._id };
    // date
    const currentDate = moment().tz("Pacific/Auckland").format();
    const date = { created: currentDate, modified: currentDate };
    // metadata
    const metadata = { type: "main", order: orderId };
    // create instance
    let checkout = new this({ service, type, entity, date, amount, metadata });
    // save instance
    try {
      await checkout.save();
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    // SUCCESS HANDLER
    return resolve(checkout);
  });
}

/* ----------------------------------------------------------------------------------------
PROCESS
---------------------------------------------------------------------------------------- */

// @FUNC  process
// @TYPE  STATIC - PROMISE - ASYNC
// @DESC  
TransactionSchema.statics.process = function (transactionId) {
  return new Promise(async (resolve, reject) => {
    // FETCH TRANSACTION
    let transaction;
    try {
      transaction = await this.findOne({ _id: transactionId });
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    // VALIDATION
    // check if transaction is of payment service
    if (transaction.service !== "payment") {
      return reject({ status: "failed", content: "transaction is not of payment service" });
    }
    // check if the transaction has been succeeded
    if (transaction.status === "succeeded") {
      return reject({ status: "failed", content: "transaction has already been processed" });
    }
    // check if transaction has been refunded
    if (transaction.status === "refunded") {
      return reject({ status: "failed", content: "transaction has been refunded" });
    }
    // check if transaction has been cancelled
    if (transaction.status === "cancelled") {
      return reject({ status: "failed", content: "transaction has been cancelled" });
    }
    // FETCH ACTIVE BONUSES AND DEPOSITS
    let bonusTransactions;
    let depositTransactions;
    const promises1 = [
      this.find({ service: "bonus", status: "active" }),
      this.find({ service: "deposit", status: "active" })
    ];
    try {
      [bonusTransactions, depositTransactions] = await Promise.all(promises1);
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    // SEPARATE BONUSES
    let bankTransferBonuses = bonusTransactions.filter(bonusTransaction => bonusTransaction.type === "bankTransfer");
    let creditBonuses = bonusTransactions.filter(bonusTransaction => bonusTransaction.type === "credit");
    // SEPARATE DEPOSITS
    let bankTransferDeposits = depositTransactions.filter(depositTransaction => depositTransaction.type === "bankTransfer");
    let onlinePaymentDeposits = depositTransactions.filter(depositTransaction => depositTransaction.type === "onlinePayment");
    // SORT TRANSACTIONS
    // TO DO .....
    // sort transactions based on their date of creation ascending
    // TO DO .....
    // PROCESS TRANSACTION
    let promises2 = [];
    // credit
    for (let i = 0; i < creditBonuses.length; i++) {
      let creditBonus = creditBonuses[i];
      let [payed, updatedCreditBonus] = transaction.creditPay(creditBonus);
      // save credit changes
      promises2.push(updatedCreditBonus.save());
      if (payed) {
        // save transaction
        promises2.push(transaction.save());
        try {
          await Promise.all(promises2);
        } catch (error) {
          return reject({ status: "error", content: error });
        }
        return resolve(transaction);
      }
    }
    // bank transfer
    for (let i = 0; i < bankTransferDeposits.length; i++) {
      let bankTransferDeposit = bankTransferDeposits[i];
      let bankTransferBonus = bankTransferBonuses.find(bonus => {
        return (String(bonus.metadata.bankTransfer) == String(bankTransferDeposit._id));
      });
      let [
        payed, updatedBankTransferDeposit, updatedBankTransferBonus
      ] = transaction.bankTransferPay(bankTransferDeposit, bankTransferBonus);
      // save bank transfer and bonus changes
      promises2.push(updatedBankTransferDeposit.save());
      promises2.push(updatedBankTransferBonus.save());
      if (payed) {
        // save transaction
        promises2.push(transaction.save());
        try {
          await Promise.all(promises2);
        } catch (error) {
          return reject({ status: "error", content: error });
        }
        return resolve(transaction);
      }
    }
    // online payment

    // COMPLETION HANDLER
    // save transaction
    promises2.push(transaction.save());
    try {
      await Promise.all(promises2);
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    return resolve(transaction);
  });
}

/* ========================================================================================
METHODS
======================================================================================== */

// @FUNC  remainingAmount
// @TYPE  METHODS
// @DESC  
TransactionSchema.methods.remainingAmount = function () {
  let remainingAmount = this.amount;
  for (let i = 0; i < this.tickets.length; i++) {
    const ticket = this.tickets[i];
    remainingAmount = remainingAmount - ticket.amount;
  }
  return remainingAmount;
}

// @FUNC  remainingBalance
// @TYPE  METHODS
// @DESC  
TransactionSchema.methods.remainingBalance = function () {
  let remainingBalance = this.amount;
  for (let i = 0; i < this.usages.length; i++) {
    const usage = this.usages[i];
    remainingBalance = remainingBalance - usage.amount;
  }
  return remainingBalance;
}

// @FUNC  creditPay
// @TYPE  METHODS
// @DESC  
TransactionSchema.methods.creditPay = function (credit) {
  // DECLARE AND INITIALISE VARIABLES
  const remainingBalance = credit.remainingBalance();
  const remainingAmount = this.remainingAmount();
  let payed;
  let usage;
  let ticket;
  if (remainingAmount > remainingBalance) {
    // update credit
    usage = { id: this._id, amount: remainingBalance };
    credit.usages.push(usage);
    credit.status = "consumed";
    // update payment
    ticket = { id: credit._id, amount: remainingBalance };
    this.tickets.push(ticket);
    payed = false;
  } else if (remainingAmount < remainingBalance) {
    // update credit
    usage = { id: this._id, amount: remainingAmount };
    credit.usages.push(usage);
    // update payment
    ticket = { id: credit._id, amount: remainingAmount };
    this.tickets.push(ticket);
    this.status = "succeeded";
    payed = true;
  } else if (remainingAmount === remainingBalance) {
    // update credit
    usage = { id: this._id, amount: remainingBalance };
    credit.usages.push(usage);
    credit.status = "consumed";
    // update payment
    ticket = { id: credit._id, amount: remainingAmount };
    this.tickets.push(ticket);
    this.status = "succeeded";
    payed = true;
  }
  return [payed, credit];
}

// @FUNC  bankTransferPay
// @TYPE  METHODS
// @DESC  
TransactionSchema.methods.bankTransferPay = function (deposit, bonus) {
  const depositRemainingBalance = deposit.remainingBalance();
  const bonusRemainingBalance = bonus.remainingBalance();
  const remainingBalance = depositRemainingBalance + bonusRemainingBalance;
  const remainingAmount = this.remainingAmount();
  let payed;
  let usageDeposit;
  let ticketDeposit;
  let usageBonus;
  let ticketBonus;
  if (remainingAmount > remainingBalance) {
    // update bank transfer
    usageDeposit = { id: this._id, amount: depositRemainingBalance };
    deposit.usages.push(usageDeposit);
    deposit.status = "consumed";
    // update bonus
    usageBonus = { id: this._id, amount: bonusRemainingBalance };
    bonus.usages.push(usageBonus);
    bonus.status = "consumed";
    // update payment
    ticketDeposit = { id: deposit._id, amount: depositRemainingBalance };
    this.tickets.push(ticketDeposit);
    ticketBonus = { id: bonus._id, amount: bonusRemainingBalance };
    this.tickets.push(ticketBonus);
    payed = false;
  } else if (remainingAmount < remainingBalance) {
    let calculate = true;
    let cumulativeDepositSpend = 0;
    let cumulativeBonusSpend = 0;
    let cumulativeAmountPay = 0;
    while (calculate) {
      const [depositSpend, bonusSpend] = this.bankTransferPartialPay(
        depositRemainingBalance - cumulativeDepositSpend,
        bonusRemainingBalance - cumulativeBonusSpend,
        remainingAmount - cumulativeAmountPay
      );
      cumulativeDepositSpend = cumulativeDepositSpend + depositSpend;
      cumulativeBonusSpend = cumulativeBonusSpend + bonusSpend;
      cumulativeAmountPay = cumulativeAmountPay + (depositSpend + bonusSpend);
      if (cumulativeAmountPay === remainingAmount) {
        calculate = false;
      }
    }
    // update bank transfer
    usageDeposit = { id: this._id, amount: cumulativeDepositSpend };
    deposit.usages.push(usageDeposit);
    // update bonus
    usageBonus = { id: this._id, amount: cumulativeBonusSpend };
    bonus.usages.push(usageBonus);
    // update payment
    ticketDeposit = { id: deposit._id, amount: cumulativeDepositSpend };
    this.tickets.push(ticketDeposit);
    ticketBonus = { id: bonus._id, amount: cumulativeBonusSpend };
    this.tickets.push(ticketBonus);
    this.status = "succeeded";
    payed = true;
  } else if (remainingAmount === remainingBalance) {
    // update bank transfer
    usageDeposit = { id: this._id, amount: depositRemainingBalance };
    deposit.usages.push(usageDeposit);
    deposit.status = "consumed";
    // update bonus
    usageBonus = { id: this._id, amount: bonusRemainingBalance };
    bonus.usages.push(usageBonus);
    bonus.status = "consumed";
    // update payment
    ticketDeposit = { id: deposit._id, amount: depositRemainingBalance };
    this.tickets.push(ticketDeposit);
    ticketBonus = { id: bonus._id, amount: bonusRemainingBalance };
    this.tickets.push(ticketBonus);
    this.status = "succeeded";
    payed = true;
  }
  return [payed, deposit, bonus];
}

// @FUNC  bankTransferPartialPay
// @TYPE  METHODS
// @DESC  
TransactionSchema.methods.bankTransferPartialPay = function (deposit, bonus, amount) {
  let depositFloor = Math.floor(deposit / 20);
  let depositModulus = deposit % 20;
  let bonusFloor = Math.floor(bonus / 1);
  let bonusModulus = bonus % 1;

  let spend;
  let spendType;
  if ((depositFloor + 1) === bonusFloor) {
    if (depositModulus === 0) {
      spend = 1;
      spendType = "bonus";
    } else if (depositModulus !== 0) {
      const limit = depositFloor * 20;
      spend = deposit - limit;
      spendType = "deposit";
    }
  } else if (depositFloor === bonusFloor) {
    if (bonusModulus !== 0) {
      spend = bonusModulus;
      spendType = "bonus";
    } else if (bonusModulus === 0) {
      const limit = (depositFloor - 1) * 20;
      spend = deposit - limit;
      spendType = "deposit";
    }
  }

  if (amount <= spend) {
    spend = amount;
  };

  let bonusSpend = 0;
  let depositSpend = 0;
  if (spendType === "bonus") {
    bonusSpend = spend;
  } else if (spendType === "deposit") {
    depositSpend = spend;
  }
  return [depositSpend, bonusSpend];
}

/*=========================================================================================
EXPORT ITEM MODEL
=========================================================================================*/

module.exports = Transaction = mongoose.model("transactions", TransactionSchema);

/*=========================================================================================
END
=========================================================================================*/
