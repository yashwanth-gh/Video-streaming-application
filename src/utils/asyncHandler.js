/*
! this is promise based async handler for try catch base async handler: go here -> './tryCatchAsyncHandler.txt' 
*/


/*
 * Wraps a request handler function with error handling and async support.
 * @param {function} requestHandler - The request handler function to be wrapped.
 * @returns {function} - The wrapped request handler function.
 */
const asyncHandler = (requestHandler) => {
    /*
     * The wrapped request handler function.
     * @param {object} req - The request object.
     * @param {object} res - The response object.
     * @param {function} next - The next middleware function.
     */
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
            .catch(err => next(err));
    };
};


export {asyncHandler}
