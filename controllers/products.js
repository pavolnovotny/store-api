import express from "express"
import Product from "../models/product.js";

export const getAllProductsStatic = async (req,res) => {
  const products = await Product.find({}).select('name price').limit(4)
    .sort('-name price')
  res.status(200).json({
    products,
    nbHits: products.length
  })
}

export const getAllProducts = async (req,res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query
  const queryObject = {}

  if (featured) queryObject.featured = featured === 'true' ? true : false

  if (company) queryObject.company = company

  if (name) queryObject.name = {$regex: name, $options: 'i'}

  if (numericFilters) {
    const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '<': '$lt',
      '<=': '$lte',
    }

    const regEx = /\b(<|>|>=|=|<|<=)\b/g
    let filters = numericFilters.replace(regEx, (match) => `-${operatorMap[match]}-`)

    const options = ['price', 'rating']
    filters = filters.split(',').forEach((item) => {
      const [] = item.split('-')
      const [field, opetator, value] = item.split('-')
      if (options.includes(field)) {
        queryObject[field] = {[opetator]: Number(value)}
      }
    })
  }

  let result = Product.find((queryObject))

  if (sort) {
    const sortList = sort.split(',').join(' ')
    result = result.sort(sortList)
  } else {
    result = result.sort('createdAt')
  }

  if (fields) {
    const fieldList = fields.split(',').join(' ')
    result = result.select(fieldList)
  }

  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit)  || 10
  const skip = (page - 1) * limit

  result = result.skip(skip).limit(limit)

  const products = await result

  console.log(req.query)
  res.status(200).json({products, nbHits: products.length})
}

