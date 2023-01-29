import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class UsersService {
  fetchUser() {
    return [
      {
        name: 'Krishan',
        email: 'krishan@gmail.com',
      },
      {
        name: 'Krish',
        email: 'krish@gmail.com',
      },
    ];
  }

  assignUser(name) {
    return name;
  }

  getData(alias) {
    return new Promise(async (resolve, reject) => {
      await axios
        .get('https://trailblazer.me/id/' + alias, {
          headers: {
            'Accept-Encoding': 'gzip=true',
          },
        })
        .then((response) => {
          // reject({ code: 500, message: 'xyz' });
          resolve(response.data);
        })
        .catch((error) => {
          console.log('gat error ser ' + error?.code); // ERR_BAD_REQUEST
          reject({ code: 404, message: 'not found' });
        });
    });
  }

  async getMoreData() {
    return new Promise(async (resolve, reject) => {
      await axios
        .get('https://jsonplaceholder.typicode.com/post', {
          headers: {
            'Accept-Encoding': 'gzip=true',
          },
        })
        .then((response) => {
          // console.log(response.data);
          resolve(response.data);
          // reject({ code: 512, message: 'id not found' });
        })
        .catch((error) => {
          reject({ code: 412, message: 'id not found' });
        });
    });
  }

  async getSomeData() {
    return new Promise(async (resolve, reject) => {
      await axios
        .get('https://jsonplaceholder.typicode.com/posts', {
          headers: {
            'Accept-Encoding': 'gzip=true',
          },
        })
        .then((response) => {
          // console.log(response.data);
          // resolve(response.data);
          reject({ code: 501, message: '501' });
        })
        .catch((error) => {
          reject({ code: 201, message: '201' });
        });
    });
  }
}
