import request from '@/utils/request'
import * as echarts from 'echarts'

// 生成随机颜色的函数
function generateRandomColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

var myColor=['#E19895', '#DC936C','#5CC191', '#568FDE']

var option = {
  title: {
    text: '词阅读量数据',
    x: 'center',
    textStyle: {
      fontFamily: 'PingFangSC-Regular',
      fontSize: 18,
      color:'#000000',
      letterSpacing: 0,
      fontWeight: 400,
    },
    left: '3%',
    bottom: '96%',

  },
  //图标位置
  grid: {
    top: '5%',
    left: "5%",
    right: 10,
    bottom: 10,
  },
  xAxis: {
    show: false,
  },
  yAxis: [
    {
      show: true,
      data: [],
      inverse: true,
      axisLine: {
        show: false
      },
      splitLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        formatter: (value) => {
          return [
            '{title|' + value + '} '
          ].join('\n')
        },
        rich: {
          title: {
            color: '#8A9495',
            borderRadius: 10,
            padding: [0, -60, -30, 0],
            align: 'center',
            width: 10,
            height: 10,
            fontSize: 15,
            fontWeight: 400,
          },
        }
      },
    },
    {
      show: true,
      inverse: true,
      data: [],
      axisLabel: {
        formatter: (value, index) => {
          return [
            '{data|' + value + '} '
          ].join('\n')
        },
        rich: {
          data: {
            color: '#8A9495',
            borderRadius: 10,
            padding: [0, 0, -30, -60],
            align: 'center',
            width: 10,
            height: 10,
            fontSize: 15,
            fontWeight: 400,
          },
        }
      },
      axisLine: {
        show: false
      },
      splitLine: {
        show: false
      },
      axisTick: {
        show: false
      },

    }
  ],
  series: [
    {
      realtimeSort: true,
      name: '条',
      type: 'bar',
      yAxisIndex: 0,
      data: [],
      barWidth: 10,
      itemStyle: {
        normal: {
          barBorderRadius: 9,
          color: function(params) {
            return myColor[params.dataIndex]==null ? '#568FDE':myColor[params.dataIndex]
          },
        }
      },
      showBackground: true,
      backgroundStyle: {
        color: '#DCE6EE',
        borderRadius: 9
      },
      label: {
        normal: {
          show: true,
          position: 'inside',
          formatter: ''
        }
      },
    },
    {
      name: '框',
      type: 'bar',
      yAxisIndex: 1,
      barGap: '-100%',
      data: [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000],
      barWidth: 10,
      itemStyle: {
        normal: {
          color: 'none',
          barBorderRadius: 9
        }
      }
    },
  ]
};


function chart_1(resContent) {
  var myChart1 = echarts.init(document.getElementById('chart1'))
  option.yAxis[0].data=[]
  option.yAxis[1].data=[]
  option.series[0].data=[]
  myChart1.setOption(option);
  var content;
  for (let i = 0; i < resContent.length; ++i) {
    (function (i) {
      content = resContent[i]
      // console.log("content====" + JSON.stringify(content) + "==="+i+myColor[i])
      option.yAxis[0].data.push(content.title);
      option.yAxis[1].data.push(content.total);
      option.series[0].data.push(content.total);
      myChart1.setOption(option);
    })(i);
  }
}
function chart_2(resContent) {
  var myChart2 = echarts.init(document.getElementById('chart2'))
  option.series[0].data=[]
  option.yAxis[0].data=[]
  option.yAxis[1].data=[]
  myChart2.setOption(option);
  var content;
  for (let i = 0; i < resContent.length; ++i) {
    (function (i) {
      content = resContent[i]
      option.yAxis[0].data.push(content.title);
      option.yAxis[1].data.push(content.total);
      option.series[0].data.push(content.total);
      myChart2.setOption(option);
    })(i);
  }
}
function chart_3(resContent) {
  var myChart3 = echarts.init(document.getElementById('chart3'))
  option.series[0].data=[]
  option.yAxis[0].data=[]
  option.yAxis[1].data=[]
  myChart3.setOption(option);
  var content;
  for (let i = 0; i < resContent.length; ++i) {
    (function (i) {
      content = resContent[i]
      // console.log("content====" + JSON.stringify(content) + "==="+i+myColor[i])
      option.yAxis[0].data.push(content.title);
      option.yAxis[1].data.push(content.total);
      option.series[0].data.push(content.total);
      myChart3.setOption(option);
    })(i);
  }
}


export default {
  chart_1,
  chart_2,
  chart_3
}
