var app=function(){"use strict";function e(){}function t(e,t){for(const n in t)e[n]=t[n];return e}function n(e){return e()}function r(){return Object.create(null)}function o(e){e.forEach(n)}function c(e){return"function"==typeof e}function l(e,t){return e!=e?t==t:e!==t||e&&"object"==typeof e||"function"==typeof e}function i(e){const t={};for(const n in e)"$"!==n[0]&&(t[n]=e[n]);return t}let a,s=!1;function d(e,t,n,r){for(;e<t;){const o=e+(t-e>>1);n(o)<=r?e=o+1:t=o}return e}function u(e,t){s?(!function(e){if(e.hydrate_init)return;e.hydrate_init=!0;const t=e.childNodes,n=new Int32Array(t.length+1),r=new Int32Array(t.length);n[0]=-1;let o=0;for(let e=0;e<t.length;e++){const c=d(1,o+1,(e=>t[n[e]].claim_order),t[e].claim_order)-1;r[e]=n[c]+1;const l=c+1;n[l]=e,o=Math.max(l,o)}const c=[],l=[];let i=t.length-1;for(let e=n[o]+1;0!=e;e=r[e-1]){for(c.push(t[e-1]);i>=e;i--)l.push(t[i]);i--}for(;i>=0;i--)l.push(t[i]);c.reverse(),l.sort(((e,t)=>e.claim_order-t.claim_order));for(let t=0,n=0;t<l.length;t++){for(;n<c.length&&l[t].claim_order>=c[n].claim_order;)n++;const r=n<c.length?c[n]:null;e.insertBefore(l[t],r)}}(e),(void 0===e.actual_end_child||null!==e.actual_end_child&&e.actual_end_child.parentElement!==e)&&(e.actual_end_child=e.firstChild),t!==e.actual_end_child?e.insertBefore(t,e.actual_end_child):e.actual_end_child=t.nextSibling):t.parentNode!==e&&e.appendChild(t)}function f(e,t,n){s&&!n?u(e,t):(t.parentNode!==e||n&&t.nextSibling!==n)&&e.insertBefore(t,n||null)}function h(e){e.parentNode.removeChild(e)}function g(e){return document.createElement(e)}function m(){return function(e){return document.createTextNode(e)}(" ")}function p(e,t,n){null==n?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function $(e,t){for(const n in t)p(e,n,t[n])}function b(e){a=e}const w=[],v=[],y=[],x=[],_=Promise.resolve();let M=!1;function k(e){y.push(e)}let C=!1;const E=new Set;function j(){if(!C){C=!0;do{for(let e=0;e<w.length;e+=1){const t=w[e];b(t),z(t.$$)}for(b(null),w.length=0;v.length;)v.pop()();for(let e=0;e<y.length;e+=1){const t=y[e];E.has(t)||(E.add(t),t())}y.length=0}while(w.length);for(;x.length;)x.pop()();M=!1,C=!1,E.clear()}}function z(e){if(null!==e.fragment){e.update(),o(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(k)}}const S=new Set;function H(e,t){e&&e.i&&(S.delete(e),e.i(t))}function F(e,t,n,r){if(e&&e.o){if(S.has(e))return;S.add(e),undefined.c.push((()=>{S.delete(e),r&&(n&&e.d(1),r())})),e.o(t)}}function A(e){e&&e.c()}function L(e,t,r,l){const{fragment:i,on_mount:a,on_destroy:s,after_update:d}=e.$$;i&&i.m(t,r),l||k((()=>{const t=a.map(n).filter(c);s?s.push(...t):o(t),e.$$.on_mount=[]})),d.forEach(k)}function O(e,t){const n=e.$$;null!==n.fragment&&(o(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function T(e,t){-1===e.$$.dirty[0]&&(w.push(e),M||(M=!0,_.then(j)),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function D(t,n,c,l,i,d,u=[-1]){const f=a;b(t);const g=t.$$={fragment:null,ctx:null,props:d,update:e,not_equal:i,bound:r(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(f?f.$$.context:n.context||[]),callbacks:r(),dirty:u,skip_bound:!1};let m=!1;if(g.ctx=c?c(t,n.props||{},((e,n,...r)=>{const o=r.length?r[0]:n;return g.ctx&&i(g.ctx[e],g.ctx[e]=o)&&(!g.skip_bound&&g.bound[e]&&g.bound[e](o),m&&T(t,e)),n})):[],g.update(),m=!0,o(g.before_update),g.fragment=!!l&&l(g.ctx),n.target){if(n.hydrate){s=!0;const e=function(e){return Array.from(e.childNodes)}(n.target);g.fragment&&g.fragment.l(e),e.forEach(h)}else g.fragment&&g.fragment.c();n.intro&&H(t.$$.fragment),L(t,n.target,n.anchor,n.customElement),s=!1,j()}b(f)}class N{$destroy(){O(this,1),this.$destroy=e}$on(e,t){const n=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return n.push(t),()=>{const e=n.indexOf(t);-1!==e&&n.splice(e,1)}}$set(e){var t;this.$$set&&(t=e,0!==Object.keys(t).length)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}function V(e,t,n){return e(n={path:t,exports:{},require:function(e,t){return function(){throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs")}(null==t&&n.path)}},n.exports),n.exports}var I=V((function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.merge=void 0,t.merge=function(e,t,n){const r=Object.create(null),o=[e,t,n];for(let e=0;e<3;e++){const t=o[e];if("object"==typeof t&&t)for(const e in t)r[e]=t[e]}return r}})),P=V((function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.fullCustomisations=t.defaults=void 0,t.defaults=Object.freeze({inline:!1,width:null,height:null,hAlign:"center",vAlign:"middle",slice:!1,hFlip:!1,vFlip:!1,rotate:0}),t.fullCustomisations=function(e){return I.merge(t.defaults,e)}})),B=V((function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.alignmentFromString=t.flipFromString=void 0;const n=/[\s,]+/;t.flipFromString=function(e,t){t.split(n).forEach((t=>{switch(t.trim()){case"horizontal":e.hFlip=!0;break;case"vertical":e.vFlip=!0}}))},t.alignmentFromString=function(e,t){t.split(n).forEach((t=>{const n=t.trim();switch(n){case"left":case"center":case"right":e.hAlign=n;break;case"top":case"middle":case"bottom":e.vAlign=n;break;case"slice":case"crop":e.slice=!0;break;case"meet":e.slice=!1}}))}})),G=V((function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.rotateFromString=void 0,t.rotateFromString=function(e){const t=e.replace(/^-?[0-9.]*/,"");function n(e){for(;e<0;)e+=4;return e%4}if(""===t){const t=parseInt(e);return isNaN(t)?0:n(t)}if(t!==e){let r=0;switch(t){case"%":r=25;break;case"deg":r=90}if(r){let o=parseFloat(e.slice(0,e.length-t.length));return isNaN(o)?0:(o/=r,o%1==0?n(o):0)}}return 0}})),q=V((function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.fullIcon=t.iconDefaults=void 0,t.iconDefaults=Object.freeze({body:"",left:0,top:0,width:16,height:16,rotate:0,vFlip:!1,hFlip:!1}),t.fullIcon=function(e){return I.merge(t.iconDefaults,e)}})),Y=V((function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.calculateSize=void 0;const n=/(-?[0-9.]*[0-9]+[0-9.]*)/g,r=/^-?[0-9.]*[0-9]+[0-9.]*$/g;t.calculateSize=function(e,t,o){if(1===t)return e;if(o=void 0===o?100:o,"number"==typeof e)return Math.ceil(e*t*o)/o;if("string"!=typeof e)return e;const c=e.split(n);if(null===c||!c.length)return e;const l=[];let i=c.shift(),a=r.test(i);for(;;){if(a){const e=parseFloat(i);isNaN(e)?l.push(i):l.push(Math.ceil(e*t*o)/o)}else l.push(i);if(i=c.shift(),void 0===i)return l.join("");a=!a}}})),R=V((function(e,t){function n(e){let t="";switch(e.hAlign){case"left":t+="xMin";break;case"right":t+="xMax";break;default:t+="xMid"}switch(e.vAlign){case"top":t+="YMin";break;case"bottom":t+="YMax";break;default:t+="YMid"}return t+=e.slice?" slice":" meet",t}Object.defineProperty(t,"__esModule",{value:!0}),t.iconToSVG=void 0,t.iconToSVG=function(e,t){const r={left:e.left,top:e.top,width:e.width,height:e.height},o=[],c=t.hFlip!==e.hFlip,l=t.vFlip!==e.vFlip;let i,a,s,d=t.rotate+e.rotate;switch(c?l?d+=2:(o.push("translate("+(r.width+r.left)+" "+(0-r.top)+")"),o.push("scale(-1 1)"),r.top=r.left=0):l&&(o.push("translate("+(0-r.left)+" "+(r.height+r.top)+")"),o.push("scale(1 -1)"),r.top=r.left=0),d%=4,d){case 1:i=r.height/2+r.top,o.unshift("rotate(90 "+i+" "+i+")");break;case 2:o.unshift("rotate(180 "+(r.width/2+r.left)+" "+(r.height/2+r.top)+")");break;case 3:i=r.width/2+r.left,o.unshift("rotate(-90 "+i+" "+i+")")}d%2==1&&(0===r.left&&0===r.top||(i=r.left,r.left=r.top,r.top=i),r.width!==r.height&&(i=r.width,r.width=r.height,r.height=i)),null===t.width&&null===t.height?(s="1em",a=Y.calculateSize(s,r.width/r.height)):null!==t.width&&null!==t.height?(a=t.width,s=t.height):null!==t.height?(s=t.height,a=Y.calculateSize(s,r.width/r.height)):(a=t.width,s=Y.calculateSize(a,r.height/r.width)),"auto"===a&&(a=r.width),"auto"===s&&(s=r.height),a="string"==typeof a?a:a+"",s="string"==typeof s?s:s+"";let u=e.body;o.length&&(u='<g transform="'+o.join(" ")+'">'+u+"</g>");const f={attributes:{width:a,height:s,preserveAspectRatio:n(t),viewBox:r.left+" "+r.top+" "+r.width+" "+r.height},body:u};return t.inline&&(f.inline=!0),f}})),W=V((function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.replaceIDs=void 0;const n=/\sid="(\S+)"/g,r="IconifyId-"+Date.now().toString(16)+"-"+(16777216*Math.random()|0).toString(16)+"-";let o=0;function c(e,t,n){let r=0;for(;-1!==(r=n.indexOf(e,r));)n=n.slice(0,r)+t+n.slice(r+e.length),r+=t.length;return n}t.replaceIDs=function(e,t=r){const l=[];let i;for(;i=n.exec(e);)l.push(i[1]);return l.length?(l.forEach((n=>{const r="function"==typeof t?t():t+o++;e=c('="'+n+'"','="'+r+'"',e),e=c('="#'+n+'"','="#'+r+'"',e),e=c("(#"+n+")","(#"+r+")",e)})),e):e}}));const J={xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink","aria-hidden":!0,role:"img"};function K(n){let r,o=n[0].body+"",c=[n[0].attributes],l={};for(let e=0;e<c.length;e+=1)l=t(l,c[e]);return{c(){var e;e="svg",r=document.createElementNS("http://www.w3.org/2000/svg",e),$(r,l)},m(e,t){f(e,r,t),r.innerHTML=o},p(e,[t]){1&t&&o!==(o=e[0].body+"")&&(r.innerHTML=o),$(r,l=function(e,t){const n={},r={},o={$$scope:1};let c=e.length;for(;c--;){const l=e[c],i=t[c];if(i){for(const e in l)e in i||(r[e]=1);for(const e in i)o[e]||(n[e]=i[e],o[e]=1);e[c]=i}else for(const e in l)o[e]=1}for(const e in r)e in n||(n[e]=void 0);return n}(c,[1&t&&e[0].attributes]))},i:e,o:e,d(e){e&&h(r)}}}function Q(e,n,r){let o;return e.$$set=e=>{r(1,n=t(t({},n),i(e)))},e.$$.update=()=>{r(0,o=function(e){let t=q.fullIcon(e.icon);if(!t)return{attributes:J,body:""};const n=I.merge(P.defaults,e),r=I.merge(J);let o="string"==typeof e.style?e.style:"";for(let t in e){const c=e[t];switch(t){case"icon":case"style":break;case"flip":B.flipFromString(n,c);break;case"align":B.alignmentFromString(n,c);break;case"color":o="color: "+c+"; "+o;break;case"rotate":"number"!=typeof c?n[t]=G.rotateFromString(c):r[t]=c;break;case"ariaHidden":case"aria-hidden":!0!==c&&"true"!==c&&delete r["aria-hidden"];break;default:void 0===P.defaults[t]&&(r[t]=c)}}const c=R.iconToSVG(t,n);for(let e in c.attributes)r[e]=c.attributes[e];c.inline&&(o="vertical-align: -0.125em; "+o),""!==o&&(r.style=o);let l=0;const i=e.id;return{attributes:r,body:W.replaceIDs(c.body,i?()=>i+"-"+l++:"iconify-svelte-")}}(n))},n=i(n),[o]}class U extends N{constructor(e){super(),D(this,e,Q,K,l,{})}}var X={body:'<g fill="none"><path d="M2 5.995c0-.55.446-.995.995-.995h8.01a.995.995 0 0 1 0 1.99h-8.01A.995.995 0 0 1 2 5.995z" fill="currentColor"/><path d="M2 12c0-.55.446-.995.995-.995h18.01a.995.995 0 1 1 0 1.99H2.995A.995.995 0 0 1 2 12z" fill="currentColor"/><path d="M2.995 17.01a.995.995 0 0 0 0 1.99h12.01a.995.995 0 0 0 0-1.99H2.995z" fill="currentColor"/></g>',width:24,height:24},Z={body:'<path d="M12 11.807A9.002 9.002 0 0 1 10.049 2a9.942 9.942 0 0 0-5.12 2.735c-3.905 3.905-3.905 10.237 0 14.142c3.906 3.906 10.237 3.905 14.143 0a9.946 9.946 0 0 0 2.735-5.119A9.003 9.003 0 0 1 12 11.807z" fill="currentColor"/>',width:24,height:24};function ee(t){let n,r,o,c,l;return r=new U({props:{icon:X,width:"34",color:"#0097E6"}}),c=new U({props:{icon:Z,width:"30",color:"#5E687E"}}),{c(){n=g("header"),A(r.$$.fragment),o=m(),A(c.$$.fragment),p(n,"class","flex justify-between mt-3 mx-4")},m(e,t){f(e,n,t),L(r,n,null),u(n,o),L(c,n,null),l=!0},p:e,i(e){l||(H(r.$$.fragment,e),H(c.$$.fragment,e),l=!0)},o(e){F(r.$$.fragment,e),F(c.$$.fragment,e),l=!1},d(e){e&&h(n),O(r),O(c)}}}class te extends N{constructor(e){super(),D(this,e,null,ee,l,{})}}var ne={body:'<path fill-rule="evenodd" clip-rule="evenodd" d="M12.026 2c-5.509 0-9.974 4.465-9.974 9.974c0 4.406 2.857 8.145 6.821 9.465c.499.09.679-.217.679-.481c0-.237-.008-.865-.011-1.696c-2.775.602-3.361-1.338-3.361-1.338c-.452-1.152-1.107-1.459-1.107-1.459c-.905-.619.069-.605.069-.605c1.002.07 1.527 1.028 1.527 1.028c.89 1.524 2.336 1.084 2.902.829c.091-.645.351-1.085.635-1.334c-2.214-.251-4.542-1.107-4.542-4.93c0-1.087.389-1.979 1.024-2.675c-.101-.253-.446-1.268.099-2.64c0 0 .837-.269 2.742 1.021a9.582 9.582 0 0 1 2.496-.336a9.554 9.554 0 0 1 2.496.336c1.906-1.291 2.742-1.021 2.742-1.021c.545 1.372.203 2.387.099 2.64c.64.696 1.024 1.587 1.024 2.675c0 3.833-2.33 4.675-4.552 4.922c.355.308.675.916.675 1.846c0 1.334-.012 2.41-.012 2.737c0 .267.178.577.687.479C19.146 20.115 22 16.379 22 11.974C22 6.465 17.535 2 12.026 2z" fill="currentColor"/>',width:24,height:24},re={body:'<circle cx="4.983" cy="5.009" r="2.188" fill="currentColor"/><path d="M9.237 8.855v12.139h3.769v-6.003c0-1.584.298-3.118 2.262-3.118c1.937 0 1.961 1.811 1.961 3.218v5.904H21v-6.657c0-3.27-.704-5.783-4.526-5.783c-1.835 0-3.065 1.007-3.568 1.96h-.051v-1.66H9.237zm-6.142 0H6.87v12.139H3.095z" fill="currentColor"/>',width:24,height:24},oe={body:'<path d="M19.633 7.997c.013.175.013.349.013.523c0 5.325-4.053 11.461-11.46 11.461c-2.282 0-4.402-.661-6.186-1.809c.324.037.636.05.973.05a8.07 8.07 0 0 0 5.001-1.721a4.036 4.036 0 0 1-3.767-2.793c.249.037.499.062.761.062c.361 0 .724-.05 1.061-.137a4.027 4.027 0 0 1-3.23-3.953v-.05c.537.299 1.16.486 1.82.511a4.022 4.022 0 0 1-1.796-3.354c0-.748.199-1.434.548-2.032a11.457 11.457 0 0 0 8.306 4.215c-.062-.3-.1-.611-.1-.923a4.026 4.026 0 0 1 4.028-4.028c1.16 0 2.207.486 2.943 1.272a7.957 7.957 0 0 0 2.556-.973a4.02 4.02 0 0 1-1.771 2.22a8.073 8.073 0 0 0 2.319-.624a8.645 8.645 0 0 1-2.019 2.083z" fill="currentColor"/>',width:24,height:24},ce={body:'<path d="M11.999 7.377a4.623 4.623 0 1 0 0 9.248a4.623 4.623 0 0 0 0-9.248zm0 7.627a3.004 3.004 0 1 1 0-6.008a3.004 3.004 0 0 1 0 6.008z" fill="currentColor"/><circle cx="16.806" cy="7.207" r="1.078" fill="currentColor"/><path d="M20.533 6.111A4.605 4.605 0 0 0 17.9 3.479a6.606 6.606 0 0 0-2.186-.42c-.963-.042-1.268-.054-3.71-.054s-2.755 0-3.71.054a6.554 6.554 0 0 0-2.184.42a4.6 4.6 0 0 0-2.633 2.632a6.585 6.585 0 0 0-.419 2.186c-.043.962-.056 1.267-.056 3.71c0 2.442 0 2.753.056 3.71c.015.748.156 1.486.419 2.187a4.61 4.61 0 0 0 2.634 2.632a6.584 6.584 0 0 0 2.185.45c.963.042 1.268.055 3.71.055s2.755 0 3.71-.055a6.615 6.615 0 0 0 2.186-.419a4.613 4.613 0 0 0 2.633-2.633c.263-.7.404-1.438.419-2.186c.043-.962.056-1.267.056-3.71s0-2.753-.056-3.71a6.581 6.581 0 0 0-.421-2.217zm-1.218 9.532a5.043 5.043 0 0 1-.311 1.688a2.987 2.987 0 0 1-1.712 1.711a4.985 4.985 0 0 1-1.67.311c-.95.044-1.218.055-3.654.055c-2.438 0-2.687 0-3.655-.055a4.96 4.96 0 0 1-1.669-.311a2.985 2.985 0 0 1-1.719-1.711a5.08 5.08 0 0 1-.311-1.669c-.043-.95-.053-1.218-.053-3.654c0-2.437 0-2.686.053-3.655a5.038 5.038 0 0 1 .311-1.687c.305-.789.93-1.41 1.719-1.712a5.01 5.01 0 0 1 1.669-.311c.951-.043 1.218-.055 3.655-.055s2.687 0 3.654.055a4.96 4.96 0 0 1 1.67.311a2.991 2.991 0 0 1 1.712 1.712a5.08 5.08 0 0 1 .311 1.669c.043.951.054 1.218.054 3.655c0 2.436 0 2.698-.043 3.654h-.011z" fill="currentColor"/>',width:24,height:24};function le(t){let n,r,o,c,l,i,a,s,d,$,b,w,v,y,x,_,M,k,C,E,j,z,S,T,D,N;return d=new U({props:{icon:ne,width:"22",color:"#5E687E"}}),v=new U({props:{icon:re,width:"22",color:"#5E687E"}}),M=new U({props:{icon:oe,width:"22",color:"#5E687E"}}),j=new U({props:{icon:ce,width:"22",color:"#5E687E"}}),{c(){n=g("section"),r=g("div"),o=g("img"),l=m(),i=g("ul"),a=g("li"),s=g("a"),A(d.$$.fragment),$=m(),b=g("li"),w=g("a"),A(v.$$.fragment),y=m(),x=g("li"),_=g("a"),A(M.$$.fragment),k=m(),C=g("li"),E=g("a"),A(j.$$.fragment),z=m(),S=g("div"),S.innerHTML='<h2 class="text-3xl text-dark mx-3">Hi! ViGo here.</h2> \n    <p class="text-sm text-dark mx-3 mt-2">Fullstack Developer &amp; Network Admin</p> \n    <p class="text-xs text-secondary mt-4">Comence mi carrera como Administrador de redes en un buen Data Center. Hace poco encontre\n       el Desarrollo web y me apasione totalmente... Desde entonces me considero una combinacion de dos mundos.</p>',T=m(),D=g("div"),D.innerHTML='<buttton class="w-36 h-14 pt-4 border-2 border-decorate rounded-md text-center text-decorate font-bold">Whatsapp me</buttton> \n    <buttton class="w-36 h-14 pt-4 bg-decorate rounded-md text-center text-light font-bold">Send a mail</buttton>',o.src!==(c="images/photo.svg")&&p(o,"src","images/photo.svg"),p(o,"alt","Presentation"),p(s,"href","/"),p(w,"href","/"),p(_,"href","/"),p(E,"href","/"),p(i,"class","flex flex-col justify-between h-36"),p(r,"class","flex justify-between items-center mx-16 mt-10"),p(S,"class","mx-7 mt-3"),p(D,"class","flex justify-between mx-7 mt-5")},m(e,t){f(e,n,t),u(n,r),u(r,o),u(r,l),u(r,i),u(i,a),u(a,s),L(d,s,null),u(i,$),u(i,b),u(b,w),L(v,w,null),u(i,y),u(i,x),u(x,_),L(M,_,null),u(i,k),u(i,C),u(C,E),L(j,E,null),u(n,z),u(n,S),u(n,T),u(n,D),N=!0},p:e,i(e){N||(H(d.$$.fragment,e),H(v.$$.fragment,e),H(M.$$.fragment,e),H(j.$$.fragment,e),N=!0)},o(e){F(d.$$.fragment,e),F(v.$$.fragment,e),F(M.$$.fragment,e),F(j.$$.fragment,e),N=!1},d(e){e&&h(n),O(d),O(v),O(M),O(j)}}}class ie extends N{constructor(e){super(),D(this,e,null,le,l,{})}}var ae={body:'<path d="M403.508 229.23C491.235 87.7 315.378-58.105 190.392 23.555L71.528 99.337c-57.559 37.487-82.55 109.513-47.45 183.53c-87.761 133.132 83.005 289.03 213.116 205.762l118.864-75.782c64.673-42.583 79.512-116.018 47.45-183.616zm-297.592-80.886l118.69-75.739c77.973-46.679 167.756 34.942 135.388 110.992c-19.225-15.274-40.65-24.665-56.923-28.894c6.186-24.57-22.335-42.796-42.174-30.106l-118.95 75.48c-29.411 20.328 1.946 62.138 31.014 44.596l45.33-28.895c101.725-57.403 198 80.425 103.38 147.975l-118.692 75.739C131.455 485.225 34.11 411.96 67.592 328.5c17.786 13.463 36.677 23.363 56.923 28.894c-4.47 28.222 24.006 41.943 42.476 30.365L285.64 312.02c29.28-21.955-2.149-61.692-30.97-44.595l-45.504 28.894c-100.56 58.77-199.076-80.42-103.25-147.975z" fill="currentColor"/>',width:426,height:512},se={body:'<path d="M128 204.667C145.062 136.227 187.738 102 256 102c102.4 0 115.2 77 166.4 89.833c34.138 8.56 64-4.273 89.6-38.5C494.938 221.773 452.262 256 384 256c-102.4 0-115.2-77-166.4-89.833c-34.138-8.56-64 4.273-89.6 38.5zm-128 154C17.062 290.227 59.738 256 128 256c102.4 0 115.2 77 166.4 89.833c34.138 8.56 64-4.273 89.6-38.5C366.938 375.773 324.262 410 256 410c-102.4 0-115.2-77-166.4-89.833c-34.138-8.56-64 4.273-89.6 38.5z" fill="currentColor"/>',width:512,height:512},de={body:'<path d="M10.483 12.482h3.034L12 8.831z" fill="currentColor"/><path d="M12 3.074L3.689 6.038l1.268 10.987l7.043 3.9l7.043-3.9l1.268-10.987L12 3.074zm5.187 13.621H15.25l-1.045-2.606h-4.41L8.75 16.695H6.813L12 5.047l5.187 11.648z" fill="currentColor"/>',width:24,height:24},ue={body:'<path d="M12 21.985c-.275 0-.532-.074-.772-.202l-2.439-1.448c-.365-.203-.182-.277-.072-.314c.496-.165.588-.201 1.101-.493c.056-.037.129-.02.185.017l1.87 1.12c.074.036.166.036.221 0l7.319-4.237c.074-.036.11-.11.11-.202V7.768c0-.091-.036-.165-.11-.201l-7.319-4.219c-.073-.037-.165-.037-.221 0L4.552 7.566c-.073.036-.11.129-.11.201v8.457c0 .073.037.166.11.202l2 1.157c1.082.548 1.762-.095 1.762-.735V8.502c0-.11.091-.221.22-.221h.936c.108 0 .22.092.22.221v8.347c0 1.449-.788 2.294-2.164 2.294c-.422 0-.752 0-1.688-.46l-1.925-1.099a1.55 1.55 0 0 1-.771-1.34V7.786c0-.55.293-1.064.771-1.339l7.316-4.237a1.637 1.637 0 0 1 1.544 0l7.317 4.237c.479.274.771.789.771 1.339v8.458c0 .549-.293 1.063-.771 1.34l-7.317 4.236c-.241.11-.516.165-.773.165zm2.256-5.816c-3.21 0-3.87-1.468-3.87-2.714c0-.11.092-.221.22-.221h.954c.11 0 .201.073.201.184c.147.971.568 1.449 2.514 1.449c1.54 0 2.202-.35 2.202-1.175c0-.477-.185-.825-2.587-1.063c-1.999-.2-3.246-.643-3.246-2.238c0-1.485 1.247-2.366 3.339-2.366c2.347 0 3.503.809 3.649 2.568a.297.297 0 0 1-.056.165c-.037.036-.091.073-.146.073h-.953a.212.212 0 0 1-.202-.164c-.221-1.012-.789-1.34-2.292-1.34c-1.689 0-1.891.587-1.891 1.027c0 .531.237.696 2.514.99c2.256.293 3.32.715 3.32 2.294c-.02 1.615-1.339 2.531-3.67 2.531z" fill="currentColor"/>',width:24,height:24},fe={body:'<path d="M21.62 11.108l-8.731-8.729a1.292 1.292 0 0 0-1.823 0L9.257 4.19l2.299 2.3a1.532 1.532 0 0 1 1.939 1.95l2.214 2.217a1.53 1.53 0 0 1 1.583 2.531c-.599.6-1.566.6-2.166 0a1.536 1.536 0 0 1-.337-1.662l-2.074-2.063V14.9c.146.071.286.169.407.29a1.537 1.537 0 0 1 0 2.166a1.536 1.536 0 0 1-2.174 0a1.528 1.528 0 0 1 0-2.164c.152-.15.322-.264.504-.339v-5.49a1.529 1.529 0 0 1-.83-2.008l-2.26-2.271l-5.987 5.982c-.5.504-.5 1.32 0 1.824l8.731 8.729a1.286 1.286 0 0 0 1.821 0l8.69-8.689a1.284 1.284 0 0 0 .003-1.822" fill="currentColor"/>',width:24,height:24},he={body:'<path d="M15.332 8.668a3.333 3.333 0 0 0 0-6.663H8.668a3.333 3.333 0 0 0 0 6.663a3.333 3.333 0 0 0 0 6.665a3.333 3.333 0 0 0 0 6.664A3.334 3.334 0 0 0 12 18.664V8.668h3.332z" fill="currentColor"/><circle cx="15.332" cy="12" r="3.332" fill="currentColor"/>',width:24,height:24},ge={body:'<g fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M5 21a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5zm1-3V6h12v12h-3V9h-3v9H6z" fill="currentColor"/></g>',width:24,height:24};function me(t){let n,r,o,c,l,i,a,s,d,$,b,w,v,y,x,_,M,k,C,E,j,z,S,T,D,N,V,I,P,B,G,q,Y,R,W,J,K,Q,X,Z,ee,te,ne,re,oe,ce,le,ie,me,pe,$e,be,we,ve;return d=new U({props:{icon:ae,color:"#5E687E",width:"24"}}),x=new U({props:{icon:de,color:"#5E687E",width:"32"}}),j=new U({props:{icon:ue,color:"#5E687E",width:"32"}}),B=new U({props:{icon:fe,color:"#5E687E",width:"32"}}),J=new U({props:{icon:ge,color:"#5E687E",width:"32"}}),oe=new U({props:{icon:se,color:"#5E687E",width:"32"}}),$e=new U({props:{icon:he,color:"#5E687E",width:"32"}}),{c(){n=g("section"),r=g("h2"),r.textContent="Skills",o=m(),c=g("h3"),c.textContent="Development",l=m(),i=g("div"),a=g("div"),s=g("a"),A(d.$$.fragment),$=m(),b=g("div"),b.innerHTML='<div class=" bg-medium h-full w-2/3"></div>',w=m(),v=g("div"),y=g("a"),A(x.$$.fragment),_=m(),M=g("div"),M.innerHTML='<div class=" bg-medium h-full w-2/3"></div>',k=m(),C=g("div"),E=g("a"),A(j.$$.fragment),z=m(),S=g("div"),S.innerHTML='<div class=" bg-good h-full w-4/5"></div>',T=m(),D=g("h3"),D.textContent="Management",N=m(),V=g("div"),I=g("div"),P=g("a"),A(B.$$.fragment),G=m(),q=g("div"),q.innerHTML='<div class=" bg-good h-full w-10/12"></div>',Y=m(),R=g("div"),W=g("a"),A(J.$$.fragment),K=m(),Q=g("div"),Q.innerHTML='<div class=" bg-good h-full w-9/12"></div>',X=m(),Z=g("h3"),Z.textContent="Design",ee=m(),te=g("div"),ne=g("div"),re=g("a"),A(oe.$$.fragment),ce=m(),le=g("div"),le.innerHTML='<div class=" bg-good h-full w-11/12"></div>',ie=m(),me=g("div"),pe=g("a"),A($e.$$.fragment),be=m(),we=g("div"),we.innerHTML='<div class=" bg-medium h-full w-2/3"></div>',p(r,"class","text-xl ml-6 mb-3"),p(s,"href","/"),p(b,"class"," w-16 h-2 border border-dark rounded"),p(a,"class","flex justify-between items-center w-24"),p(y,"href","/"),p(M,"class"," w-16 h-2 border border-dark rounded"),p(v,"class","flex justify-between items-center w-24"),p(E,"href","/"),p(S,"class"," w-16 h-2 border border-dark rounded"),p(C,"class","flex justify-between items-center w-24"),p(i,"class","flex justify-between mt-2 mb-5"),p(P,"href","/"),p(q,"class"," w-16 h-2 border border-dark rounded"),p(I,"class","flex justify-between items-center w-24"),p(W,"href","/"),p(Q,"class"," w-16 h-2 border border-dark rounded"),p(R,"class","flex justify-between items-center w-24"),p(V,"class","flex justify-between mt-2 mb-5"),p(re,"href","/"),p(le,"class"," w-16 h-2 border border-dark rounded"),p(ne,"class","flex justify-between items-center w-24"),p(pe,"href","/"),p(we,"class"," w-16 h-2 border border-dark rounded"),p(me,"class","flex justify-between items-center w-24"),p(te,"class","flex justify-between mt-2 mb-5"),p(n,"class","mx-6 mt-5 text-secondary")},m(e,t){f(e,n,t),u(n,r),u(n,o),u(n,c),u(n,l),u(n,i),u(i,a),u(a,s),L(d,s,null),u(a,$),u(a,b),u(i,w),u(i,v),u(v,y),L(x,y,null),u(v,_),u(v,M),u(i,k),u(i,C),u(C,E),L(j,E,null),u(C,z),u(C,S),u(n,T),u(n,D),u(n,N),u(n,V),u(V,I),u(I,P),L(B,P,null),u(I,G),u(I,q),u(V,Y),u(V,R),u(R,W),L(J,W,null),u(R,K),u(R,Q),u(n,X),u(n,Z),u(n,ee),u(n,te),u(te,ne),u(ne,re),L(oe,re,null),u(ne,ce),u(ne,le),u(te,ie),u(te,me),u(me,pe),L($e,pe,null),u(me,be),u(me,we),ve=!0},p:e,i(e){ve||(H(d.$$.fragment,e),H(x.$$.fragment,e),H(j.$$.fragment,e),H(B.$$.fragment,e),H(J.$$.fragment,e),H(oe.$$.fragment,e),H($e.$$.fragment,e),ve=!0)},o(e){F(d.$$.fragment,e),F(x.$$.fragment,e),F(j.$$.fragment,e),F(B.$$.fragment,e),F(J.$$.fragment,e),F(oe.$$.fragment,e),F($e.$$.fragment,e),ve=!1},d(e){e&&h(n),O(d),O(x),O(j),O(B),O(J),O(oe),O($e)}}}class pe extends N{constructor(e){super(),D(this,e,null,me,l,{})}}class $e extends N{constructor(e){super(),D(this,e,null,null,l,{})}}function be(t){let n,r,o,c,l,i,a,s,d;return r=new te({}),c=new ie({}),i=new pe({}),s=new $e({}),{c(){n=g("main"),A(r.$$.fragment),o=m(),A(c.$$.fragment),l=m(),A(i.$$.fragment),a=m(),A(s.$$.fragment)},m(e,t){f(e,n,t),L(r,n,null),u(n,o),L(c,n,null),u(n,l),L(i,n,null),f(e,a,t),L(s,e,t),d=!0},p:e,i(e){d||(H(r.$$.fragment,e),H(c.$$.fragment,e),H(i.$$.fragment,e),H(s.$$.fragment,e),d=!0)},o(e){F(r.$$.fragment,e),F(c.$$.fragment,e),F(i.$$.fragment,e),F(s.$$.fragment,e),d=!1},d(e){e&&h(n),O(r),O(c),O(i),e&&h(a),O(s,e)}}}return new class extends N{constructor(e){super(),D(this,e,null,be,l,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map