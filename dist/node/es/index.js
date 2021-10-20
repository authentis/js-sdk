import t from"https";function e(){return{handshake:this.createRequest.call(this,{method:"PUT",path:"/captcha"}),verify:this.createRequest.call(this,{method:"POST",path:"/captcha"})}}function a(){return{state:this.createRequest.call(this,{method:"GET",path:"/auth/state"}),session:this.createRequest.call(this,{method:"POST",path:"/auth/session"}),epwd:this.createRequest.call(this,{method:"POST",path:"/auth/signin/epwd"}),epwdv:this.createRequest.call(this,{method:"PUT",path:"/auth/signin/epwd"}),eotp:this.createRequest.call(this,{method:"POST",path:"/auth/signin/eotp"}),eotpv:this.createRequest.call(this,{method:"PUT",path:"/auth/signin/eotp"}),potp:this.createRequest.call(this,{method:"POST",path:"/auth/signin/potp"}),potpv:this.createRequest.call(this,{method:"PUT",path:"/auth/signin/potp"}),revoke:this.createRequest.call(this,{method:"DELETE",path:"/auth/revoke"})}}function s(){return{create:this.createRequest.call(this,{method:"POST",path:"/org"}),update:this.createRequest.call(this,{method:"PUT",path:"/org"}),get:this.createRequest.call(this,{method:"GET",path:"/org"}),remove:this.createRequest.call(this,{method:"DELETE",path:"/org"})}}function i(){return{create:this.createRequest.call(this,{method:"POST",path:"/project"}),update:this.createRequest.call(this,{method:"PUT",path:"/project"}),get:this.createRequest.call(this,{method:"GET",path:"/project"}),remove:this.createRequest.call(this,{method:"DELETE",path:"/project"}),signinMethod:{create:this.createRequest.call(this,{method:"POST",path:"/project/signin-method"}),update:this.createRequest.call(this,{method:"PUT",path:"/project/signin-method"}),get:this.createRequest.call(this,{method:"GET",path:"/project/signin-method"}),remove:this.createRequest.call(this,{method:"DELETE",path:"/project/signin-method"})}}}function h(){return{create:this.createRequest.call(this,{method:"POST",path:"/app"}),update:this.createRequest.call(this,{method:"PUT",path:"/app"}),get:this.createRequest.call(this,{method:"GET",path:"/app"}),remove:this.createRequest.call(this,{method:"DELETE",path:"/app"})}}function o(){return{inspect:this.createRequest.call(this,{method:"PUT",path:"/device"})}}function c(t){return this.config={host:t.host||"https://auth.gozel.com.tr",version:t.version||null,projectIdentifier:t.projectIdentifier||"",projectLocale:t.locale||"",token:t.token||null,clientId:t.clientId||null,clientSecret:t.clientSecret||null},this.setLastResponse=function(t){this.lastResponse=t},this.getLastResponse=function(){return this.lastResponse},this.createAuthHeader=function(t){return t.token?"Bearer "+t.token:t.clientId&&t.clientSecret?"Basic "+btoa(t.clientId+":"+t.clientSecret):""},this.createHeaders=function(t){return Object.assign({},{Accept:"application/json","Cache-Control":"no-cache",Pragma:"no-cache"},-1!==["POST","PUT"].indexOf(t.method)?{"Content-Type":"application/json"}:{},{Authorization:this.createAuthHeader(this.config)},this.config.projectIdentifier?{"Authentis-Project-Identifier":this.config.projectIdentifier}:{},this.config.projectLocale?{"Authentis-Project-Locale":this.config.projectLocale}:{})},{getLastResponse:this.getLastResponse.bind(this),captcha:e.apply(this),auth:a.apply(this),organization:s.apply(this),project:i.apply(this),app:h.apply(this),device:o.apply(this)}}function n(e){const a=this;["POST","PUT"].indexOf(e.method);const s={method:e.method,headers:a.createHeaders.call(a,e)};return async function(i={}){return new Promise((function(h,o){let c=null;const n=new URL(e.path,a.config.host);if(i.path&&Array.isArray(i.path)&&(n.pathname+="/"+i.path.join("/")),i.searchParams&&Object.keys(i.searchParams).map((t=>n.searchParams.set(t,i.searchParams[t]))),i.id){if(/[^a-zA-Z0-9-]+/.test(i.id))return{error:{code:"REQUEST_ERROR",details:"Invalid identifier."}};n.pathname=e.path+"/"+i.id}i.body&&(c="[object Object]"===Object.prototype.toString.call(i.body)?JSON.stringify(i.body):i.body,s.headers["Content-Length"]=Buffer.byteLength(c,"utf8"));const r=t.request(n,s);r.on("socket",(function(t){t.setTimeout(5e3),t.on("timeout",(function(){r.abort()}))})),r.on("abort",(function(t){return h({error:{code:"REQUEST_ABORTED"}})})),r.on("error",(function(t){return h({error:{code:"REQUEST_ERROR"}})})),r.on("response",(function(t){let e=[],s=0;t.on("data",(function(t){e.push(t),s+=t.length})),t.on("close",(function(){return h({error:{code:"REQUEST_ERROR"}})})),t.on("end",(function(){e=Buffer.concat(e,s).toString().trim(),a.setLastResponse.call(a,t);try{return e=JSON.parse(e),e}catch(t){return{error:{code:"REQUEST_ERROR"}}}}))})),r.end(c)}))}}function r(t={}){return c.call({createRequest:n},t)}export{r as configure};
