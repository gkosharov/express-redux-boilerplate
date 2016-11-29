/**
 * Created by g.kosharov on 28.8.2016
 */
export default {
    production: {
        mongoURL: process.env.MONGODB_URI
    },
    development: {
        mongoURL: 'mongodb://localhost:27017/express-redux'
    }
};
