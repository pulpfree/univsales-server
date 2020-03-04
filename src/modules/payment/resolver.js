/* eslint-disable import/prefer-default-export */
import { savePDF } from '../../utils'

import Payment from './model'
import Quote from '../quote/model'

const updateQuotePayment = async (quoteID) => {
  if (!quoteID) {
    throw new Error('missing quote ID')
  }
  // start with fetch quote
  let quote
  try {
    quote = await Quote.findById(quoteID)
  } catch (e) {
    throw new Error(e)
  }

  // next fetch all payments and summarize
  let payments
  try {
    payments = await Payment.find({ quoteID })
  } catch (e) {
    throw new Error(e)
  }

  const payTotal = payments.reduce((accum, curVal) => accum + curVal.amount, 0.00)

  const quotePrice = Object.assign({}, quote.quotePrice)
  quotePrice.outstanding = parseFloat(quotePrice.total - payTotal)
  quotePrice.payments = payTotal

  let closed = false
  if (quotePrice.outstanding <= 0) {
    closed = true
  }

  try {
    quote = await Quote.findOneAndUpdate(
      { _id: quoteID },
      { quotePrice, closed },
      { new: true }
    )
  } catch (e) {
    throw new Error(e)
  }
  return quote
}

const find = async (quoteID) => {
  try {
    const payments = await Payment.find({ quoteID }).sort({ updatedAt: 1 })
    return payments
  } catch (e) {
    throw new Error(e)
  }
}

const paymentPersist = async (input, cfg, token) => {
  let paymentReturn
  const { quoteID } = input

  try {
    if (input._id) {
      paymentReturn = await Payment.findOneAndUpdate(
        { _id: input._id },
        input,
        { new: true },
      )
    } else {
      paymentReturn = await Payment.create(input)
    }
  } catch (e) {
    throw new Error(e)
  }
  await updateQuotePayment(paymentReturn.quoteID)

  // Save PDF
  const pdfArgs = {
    quoteID,
    docType: 'invoice',
  }
  try {
    const ret = await savePDF(pdfArgs, cfg, token)
    // we only want to return error
    if (typeof ret === 'object') {
      console.info('ret on savePDF in resolver:', ret) // eslint-disable-line no-console
      return ret
    }
  } catch (e) {
    throw new Error(e)
  }
  return paymentReturn
}

const paymentRemove = async (id, cfg, token) => {
  let paymentReturn

  // fetch payment
  const payment = await Payment.findById(id)
  const { quoteID } = payment

  // remove payment
  try {
    paymentReturn = await Payment.deleteOne({ _id: id })
  } catch (e) {
    throw new Error(e)
  }
  await updateQuotePayment(quoteID)

  // Save PDF
  const pdfArgs = {
    quoteID,
    docType: 'invoice',
  }
  try {
    const ret = await savePDF(pdfArgs, cfg, token)
    // we only want to return error
    if (typeof ret === 'object') {
      console.info('ret on savePDF in resolver:', ret) // eslint-disable-line no-console
      return ret
    }
  } catch (e) {
    throw new Error(e)
  }

  return paymentReturn
}

export const resolvers = {
  Query: {
    payments: (_, { quoteID }) => find(quoteID),
  },
  Mutation: {
    paymentPersist: (_, { input }, { cfg, token }) => paymentPersist(input, cfg, token),
    paymentRemove: (_, { id }, { cfg, token }) => paymentRemove(id, cfg, token),
  },
}
