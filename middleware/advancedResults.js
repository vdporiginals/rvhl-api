const advancedResults = (model, populate, position) => async (
  req,
  res,
  next
) => {
  let query;
  if (position) {
    req.query.position = position;
  }

  //copy req.query
  const reqQuery = {
    ...req.query,
  };

  //field to exclude
  const removeFields = ['select', 'sort', 'page', 'limit']; //pageNum and pageSize

  //loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  //create query string
  let queryStr = JSON.stringify(reqQuery);

  //create operators ($gt,$gte,...)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  //finding resource
  const newQuery = JSON.parse(queryStr);
  if (req.query.title) {
    newQuery.title = {
      $regex: new RegExp(req.query.title, 'i'),
    };
    query = model.find(newQuery, function (err, data) {});
  } else if (req.query.name) {
    newQuery.name = {
      $regex: new RegExp(req.query.name, 'i'),
    };
    query = model.find(newQuery, function (err, data) {});
  } else if (req.query.locationStart) {
    newQuery.locationStart = {
      $regex: new RegExp(req.query.locationStart, 'i'),
    };
    query = model.find(newQuery, function (err, data) {});
  } else if (req.query.address) {
    newQuery.address = {
      $regex: new RegExp(req.query.address, 'i'),
    };
    query = model.find(newQuery, function (err, data) {});
  } else if (req.query.email) {
    newQuery.email = {
      $regex: new RegExp(req.query.email, 'i'),
    };
    query = model.find(newQuery, function (err, data) {});
  } else {
    query = model.find(newQuery);
  }

  //SELECT Field
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  //sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  //pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments(query);
  if (page < 0) {
    page = 1;
  }

  query = query.skip(startIndex).limit(limit);
  if (populate) {
    query = query.populate(populate);
  }
  //excuting query

  //pagination result
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }
  const results = await query;
  res.advancedResults = {
    success: true,
    numRecord: results.length,
    count: total,
    pagination,
    data: results,
  };

  next();
};

module.exports = advancedResults;
