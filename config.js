const env = process.env;

//-- node_env: 'development' or 'production'
export default {
  port: env.PORT || 8080,
  host: env.HOST || '0.0.0.0',
  node_env: env.NODE_ENV || 'production',
  get serverUrl() {
    return `http://${this.host}:${this.port}`;
  },
  mongodbUri: 'mongodb://localhost:27017/donorschoose'
};