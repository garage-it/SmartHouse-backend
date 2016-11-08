function query(req, res) {
    //expected in params:
    /*
      req = {
          from: '2016-11-08T00:00:00.001Z',
          to: '2016-11-09T00:00:00.001Z',
          sensor: 'TEMPERATURE_1',
          stepMin: 60
      };
    */

    // @FIXME:: the file return mock data
    var responceData = {
      from: '2016-11-08T00:00:00.001Z',
      to: '2016-11-09T00:00:00.001Z',
      sensor: 'TEMPERATURE_1',
      stepMin: 60,
      data: [{
              date: '2016-11-08T00:00:00.001Z',
              value: 19
          },{
              date: '2016-11-08T00:10:00.001Z',
              value: 20
          },{
              date: '2016-11-08T00:20:00.001Z',
              value: 20,
          },{
              date: '2016-11-08T00:30:00.001Z',
              value: 20
          },{
              date: '2016-11-08T00:40:00.001Z',
              value: 20
          },{
              date: '2016-11-08T00:50:00.001Z',
              value: 20
          },{
              date: '2016-11-08T00:60:00.001Z',
              value: 21
          },{
              date: '2016-11-08T00:70:00.001Z',
              value: 21
          },{
              date: '2016-11-08T00:80:00.001Z',
              value: 22
          },{
              date: '2016-11-08T00:90:00.001Z',
              value: 22
          },{
              date: '2016-11-08T00:10:00.001Z',
              value: 22
          },{
              date: '2016-11-08T00:11:00.001Z',
              value: 23
          },{
              date: '2016-11-08T00:12:00.001Z',
              value: 23
          },{
              date: '2016-11-08T00:13:00.001Z',
              value: 24
          },{
              date: '2016-11-08T00:14:00.001Z',
              value: 24
          },{
              date: '2016-11-08T00:15:00.001Z',
              value: 25
          },{
              date: '2016-11-08T00:16:00.001Z',
              value: 24
          },{
              date: '2016-11-08T00:17:00.001Z',
              value: 24
          },{
              date: '2016-11-08T00:18:00.001Z',
              value: 23
          },{
              date: '2016-11-08T00:19:00.001Z',
              value: 23
          },{
              date: '2016-11-08T00:20:00.001Z',
              value: 22
          },{
              date: '2016-11-08T00:21:00.001Z',
              value: 22
          },{
              date: '2016-11-08T00:22:00.001Z',
              value: 21
          },{
              date: '2016-11-08T00:23:00.001Z',
              value: 20
          },{
              date: '2016-11-09T00:00:00.001Z',
              value: 19
          }
      ]
    };

    res.send(responceData);
}

export default { query };
