function GetRequest() {
   const url = decodeURI(location.search); //获取url中"?"符后的字串
   let theRequest = new Object();
   if (url.indexOf("?") != -1) {
      let str = url.substr(1);
      strs = str.split("&");
      for (let i = 0; i < strs.length; i++) {
         theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
      }
   }
   return theRequest;
}


ApiUrl = 'https://apid.dogcraft.top/miauth/'

urlp = GetRequest();

var doginfo = {};

if (urlp.response_type != "token") {
   console.log("错误调用");
   doginfo.name = "错误调用"
}
doginfo.avatarUrl = (urlp.icon ? urlp.icon : "https://www.dogcraft.top/noface.jpg");

doginfo.redirect_uri = urlp.redirect_uri ? urlp.redirect_uri : "https://a.neko.red/404/"

doginfo.name = urlp.name ? urlp.name : "APPID"

doginfo.desp = urlp.desp ? urlp.desp : "这个应用很懒，什么也没有写……"
doginfo.state = urlp.state

async function go() {
   doguploaddata = { i: tokend.token };
   uiy = await fetch(ApiUrl, {
      method: 'POST',
      body: JSON.stringify(doguploaddata),
      headers: new Headers({
         'Content-Type': 'application/json'
      })
   });
   if (uiy.status == 200) {
      rt = await uiy.json();
      res_dog = rt.r;

   } else {
      res_dog = '接口不对劲';
   }
   if (res_dog != "OK") {
      var Htmldog3 = `<div class="alert alert-danger alert-dismissible"><button type="button" class="close" data-dismiss="alert">&times;</button><strong>错误！</strong> ${res_dog}</div>`;
      $('#innf').html(Htmldog3);

   } else {
      var Htmldog4 = `<div class="alert alert-success alert-dismissible"><button type="button" class="close" data-dismiss="alert">&times;</button><strong>成功！</strong> 即将跳转 </div>`;
      console.log(rt.t);
      $('#innf').html(Htmldog4);
      Tuid = `${doginfo.redirect_uri}#access_token=${rt.t}&state=${doginfo.state}&token_type=key`
      window.location.href = Tuid;
   }
}

