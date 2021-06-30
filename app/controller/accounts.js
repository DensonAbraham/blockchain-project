const joi = require("joi");
const constants = require("../util/constants");
const httpStatus = require("../util/httpStatus");

// Utility function for extracting user facing data from the Mongoose model.
function toExternal(account) {
    return {
        id: account.id,
        userName: account.userName,
        firstName: account.firstName,
        lastName: account.lastName,
        emailAddress: account.emailAddress,
        phoneNumber: account.phoneNumber,
        addressLine1: account.addressLine1,
        addressLine2: account.addressLine2,
        city: account.city,
        state: account.state,
        country: account.country,
        zipCode: account.zipCode,
        createdAt: account.createdAt,
    };
}

// Joi schema for validating model data sent in requests.
const accountSchema = joi.object({
    userName: joi
        .string()
        .trim()
        .alphanum()
        .lowercase()
        .min(3)
        .max(30)
        .required(),
    firstName: joi.string().trim().required(),
    lastName: joi.string().trim().required(),
    emailAddress: joi.string().email().trim().empty("").default(null),
    phoneNumber: joi.string().trim().allow(null).empty("").default(null),
    addressLine1: joi.string().trim().allow(null).empty("").default(null),
    addressLine2: joi.string().trim().allow(null).empty("").default(null),
    city: joi.string().trim().allow(null).empty("").default(null),
    state: joi.string().trim().allow(null).empty("").default(null),
    country: joi.string().trim().allow(null).empty("").default(null),
    zipCode: joi.string().trim().allow(null).empty("").default(null),
});

// Joi schema for validating filter data sent in requests.
const filterSchema = joi.object({
    page: joi.number().integer().default(0),
    limit: joi
        .number()
        .integer()
        .min(10)
        .max(constants.PAGINATE_MAX_LIMIT)
        .default(20),
    dateRange: joi
        .string()
        .valid(
            "all_time",
            "last_3_months",
            "last_6_months",
            "last_9_months",
            "last_12_months",
            "last_15_months",
            "last_18_months",
            "custom"
        )
        .default("all_time"),
    startDate: joi
        .date()
        .when("date_range", { is: "custom", then: joi.required() }),
    endDate: joi
        .date()
        .when("date_range", { is: "custom", then: joi.required() }),
    search: joi.string().trim().allow(null).empty("").default(null),
});

function attachRoutes(router) {
    router.post("/accounts", async (request, response) => {
        // Validate the data sent in the request body.
        const body = request.body;
        const parameters = {
            userName: body.userName,
            firstName: body.firstName,
            lastName: body.lastName,
            emailAddress: body.emailAddress,
            phoneNumber: body.phoneNumber,
            addressLine1: body.addressLine1,
            addressLine2: body.addressLine2,
            city: body.city,
            state: body.state,
            country: body.country,
            zipCode: body.zipCode,
        };
        const { error, value } = accountSchema.validate(parameters);

        if (error) {
            return response.status(httpStatus.BAD_REQUEST).json({
                message: error.message,
            });
        }

        // ...
    });

    router.get("/accounts", async (request, response) => {
        // Validate the data sent in the request query.
        const query = request.query;
        const parameters = {
            page: query.page,
            limit: query.limit,
            dateRange: query.date_range,
            startDate: query.start_date,
            endDate: query.end_date,
            search: query.search,
        };
        const { error, value } = filterSchema.validate(parameters);
        if (error) {
            return response.status(httpStatus.BAD_REQUEST).json({
                message: error.message,
            });
        }

        // ...
    });

    const identifierPattern = /^[a-z0-9]{24}$/;
    /* An account created by one user should be hidden from another user. */
    router.get("/accounts/:identifier", async (request, response) => {
        // Validate the identifier in the URL.
        if (!identifierPattern.test(request.params.identifier)) {
            return response.status(httpStatus.BAD_REQUEST).json({
                message: "The specified account identifier is invalid.",
            });
        }

        // ...
    });

    router.put("/accounts/:identifier", async (request, response) => {
        // Validate the data sent in the request query.
        if (!identifierPattern.test(request.params.identifier)) {
            return response.status(httpStatus.BAD_REQUEST).json({
                message: "The specified account identifier is invalid.",
            });
        }

        // Validate the data sent in the request body.
        const body = request.body;
        const parameters = {
            userName: body.userName,
            firstName: body.firstName,
            lastName: body.lastName,
            emailAddress: body.emailAddress,
            phoneNumber: body.phoneNumber,
            addressLine1: body.addressLine1,
            addressLine2: body.addressLine2,
            city: body.city,
            state: body.state,
            country: body.country,
            zipCode: body.zipCode,
        };
        const { error, value } = accountSchema.validate(parameters);

        if (error) {
            return response.status(httpStatus.BAD_REQUEST).json({
                message: error.message,
            });
        }

        // ...
    });

    router.delete("/accounts/:identifier", async (request, response) => {
        // ...
    });
}

module.exports = {
    attachRoutes,
};
