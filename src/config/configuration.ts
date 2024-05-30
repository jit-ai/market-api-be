import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { join } from "path";

export default () => ({
  server_port: process.env.SERVER_PORT,
  global_prefix : process.env.GLOBAL_PREFIX,
  database: {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [process.env.DB_ENTITIES],
    synchronize: true,
  },
  mailConfig: {
    transport: {
      host: process.env.MAIL_HOST,
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_USERNAME, // generated ethereal user
        pass: process.env.MAIL_PASSWORD
      },
    },
    defaults: {
      from: '"nest-modules" <modules@nestjs.com>',
    },
    template: {
      dir: join(__dirname, 'common/helpers/mail/templates'),
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
      },
    },
  },
});
