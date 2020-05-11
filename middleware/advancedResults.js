const advancedResults = (model, populate, position) => async (
  req,
  res,
  next
) => {
  let query;
  if (position) {
    req.query.position = position;
    console.log(position);
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
  if (req.query.title) {
    query = model.find(
      {
        title: {
          $regex: new RegExp(req.query.title, 'i'),
        },
      },
      JSON.parse(queryStr),
      {
        _id: 0,
      },
      function (err, data) {}
    );
  } else if (req.query.name) {
    query = model.find(
      {
        name: {
          $regex: new RegExp(req.query.name, 'i'),
        },
      },
      JSON.parse(queryStr),
      {
        _id: 0,
      },
      function (err, data) {}
    );
  } else {
    query = model.find(JSON.parse(queryStr));
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
  const total = await model.countDocuments();
  if (page < 0) {
    page = 1;
  }

  query = query.skip(startIndex).limit(limit);
  if (populate) {
    query = query.populate(populate);
  }
  console.log(model);
  console.log(populate);
  //excuting query
  const results = await query;

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
