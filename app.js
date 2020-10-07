// version v0.0.1
// create by ruicky
// detail url: https://github.com/ruicky/jd_sign_bot

const exec = require('child_process').execSync
const fs = require('fs')
const rp = require('request-promise')
const download = require('download')

// 公共变量
const KEY = process.env.JD_COOKIE
const serverJ = process.env.PUSH_KEY
const iqyi_key = process.env.IQIYI_COOKIE

async function downFile () {
    const url = 'https://raw.githubusercontent.com/NobyDa/Script/master/JD-DailyBonus/JD_DailyBonus.js'
    await download(url, './')
}


async function downFile2 () {
  const url = 'https://raw.githubusercontent.com/NobyDa/Script/master/iQIYI-DailyBonus/iQIYI.js'
  await download(url, './')
}

async function changeFiele () {
   let content = await fs.readFileSync('./JD_DailyBonus.js', 'utf8')
   content = content.replace(/var Key = ''/, `var Key = '${KEY}'`)
   await fs.writeFileSync( './JD_DailyBonus.js', content, 'utf8')
}

async function changeFiele2 () {
  let content = await fs.readFileSync('./iQIYI.js', 'utf8')
  content = content.replace(/var cookie = ''/, `var cookie = '${iqyi_key}'`)
  await fs.writeFileSync( './iQIYI.js', content, 'utf8')
}


async function sendNotify (text,desp) {
  const options ={
    uri:  `https://sc.ftqq.com/${serverJ}.send`,
    form: { text, desp },
    json: true,
    method: 'POST'
  }
  await rp.post(options).then(res=>{
    console.log(res)
  }).catch((err)=>{
    console.log(err)
  })
}

async function start() {
  if (!KEY) {
    console.log('请填写 key 后在继续')
    return
  }
  // 下载最新代码
  await downFile();
  await downFile2();
  console.log('下载代码完毕')
  // 替换变量
  await changeFiele();
  await changeFiele2();
  console.log('替换变量完毕')
  // 执行
  await exec("node JD_DailyBonus.js >> result.txt");
  await exec("node iQIYI.js >> result1.txt");
  console.log('执行完毕')

  if (serverJ) {
    const path = "./result.txt";
    const path1 = "./result1.txt";
    let content = "";
    if (fs.existsSync(path)) {
      content = fs.readFileSync(path, "utf8");
    }
    if (fs.existsSync(path1)) {
      content1 = fs.readFileSync(path1, "utf8");
    }
    await sendNotify("京东+IQIYI 签到-" + new Date().toLocaleDateString(), content + '\n' + content1);
    console.log(content + '\n' + content1)
    console.log('发送结果完毕')
  }
}

start()
