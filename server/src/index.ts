import dotenv from 'dotenv';
dotenv.config();

import Express from 'express';
import bodyParser from 'body-parser';
// import { param, body, validationResult } from 'express-validator';
import cors from 'cors';

import { Product, Device, Genre, DB } from './libs/core';

const PORT = 53894;
const PREFIX = ['NP', 'TN', 'UN', 'NW', 'MN', 'MA', 'AG', 'AJ'];

const GENRE: Genre[] = [
  'broadcast',
  'pa',
  'venue',
  'pr',
  'transpotation',
  'communication',
  'oa',
  'other',
];

class Kizai {
  private app: Express.Application;
  private core: DB;

  constructor(o: { dbUri: string | undefined; dbName: string | undefined }) {
    if (!o.dbUri) throw new Error('データベースURIが入力されていません。');
    if (!o.dbName) throw new Error('データベース名が入力されていません。');

    this.app = Express();
    this.core = new DB(o.dbUri, o.dbName);
  }

  public start() {
    this._corsMiddleware();
    this._bodyParserMiddleware();

    this._indexRoute();

    this._searchDevicesRoute();

    this._addProductRoute();
    this._addDeviceRoute();

    this._addReservationRoute();

    this.core.start();
    this.app.listen(PORT, () => console.log(`Port ${PORT} listening...`));
  }

  private _corsMiddleware() {
    this.app.use(cors());
  }

  private _bodyParserMiddleware() {
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
  }

  private _indexRoute() {
    this.app.get('/', (req: Express.Request, res: Express.Response) => {
      return res.json({ msg: 'hello world' });
    });
  }

  private _addProductRoute() {
    this.app.post(
      '/products',
      // [
      //   body('genre').isIn(GENRE),
      //   body('name').not().isEmpty(),
      //   body('maker').not().isEmpty(),
      // ],
      async (req: Express.Request, res: Express.Response) => {
        // const errors = validationResult(req).array();
        // if (errors) {
        //   return res.status(429);
        // }

        const [genre, name, maker] = req.body;

        const productId = await this.core.addProduct({
          genre,
          name,
          maker,
        });

        return res.json({ productId });
      }
    );
  }

  private _addDeviceRoute() {
    this.app.post(
      '/products/:productId',
      // [
      //   param('productId').isAlphanumeric(),
      //   body('prefix').isIn(PREFIX),
      //   body('serialNumber'),
      //   body('accessories'),
      //   body('remarks'),
      // ],
      async (req: Express.Request, res: Express.Response) => {
        // const errors = validationResult(req).array();
        // if (errors) {
        //   return res.status(429);
        // }

        const [serialNumber, accessories, remarks, prefix, jan] = req.body;

        const deviceId = await this.core.addDevice({
          productId: req.params.productId,
          serialNumber,
          accessories,
          remarks,
          jan,
        });

        const latestDevice = await this.core.latestDevice();
        const code = this._generateDeviceCode(prefix, latestDevice.numberId);
        this.core.fetchDeviceCode(deviceId.toHexString(), code);
        return res.json({ code });
      }
    );
  }

  private _addReservationRoute() {
    this.app.post(
      '/reservations/:eventCode',
      async (req: Express.Request, res: Express.Response) => {
        const reservationId = await this.core.addReservation({
          eventCode: req.params.eventCode,
          devices: req.body.devices,
        });
        return res.json({ reservationId });
      }
    );
  }
  private _generateDeviceCode(prefix: string, id: number | undefined): string {
    return `${prefix}-${('0000' + (id ? id : this.core.countDevices())).slice(
      -4
    )}`;
  }

  private _searchDevicesRoute() {
    this.app.post(
      '/products/search',
      // [body('searchText')],
      async (req: Express.Request, res: Express.Response) => {
        // const errors = validationResult(req).array();
        // if (errors) {
        //   return res.status(429);
        // }

        const products = await this.core.omniProductsSearch(
          req.body.searchText
        );
        // console.log(products);
        const result = await Promise.all(
          products.map(async (product: Product) => {
            const devices = await this.core.findDevicesByProductId(product._id);
            return {
              id: product._id,
              name: product.name,
              maker: product.maker,
              genre: product.genre,
              devices: devices.map((device: Device) => {
                return {
                  code: device.code,
                  serialNumber: device.serialNumber,
                  status: device.status,
                  remarks: device.remarks,
                };
              }),
            };
          })
        );
        return res.json(result);
      }
    );
  }
}

const kizai = new Kizai({
  dbUri: process.env.DB_URI,
  dbName: process.env.DB_NAME,
});
kizai.start();
