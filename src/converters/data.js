import { readText, getExt } from '../utils.js';
function toXML(obj, root='root') {
  const esc = s => String(s).replace(/[<>&"']/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&#39;'}[c]));
  const build = (v, tag) => {
    if (v == null) return '<' + tag + '></' + tag + '>';
    if (typeof v !== 'object') return '<' + tag + '>' + esc(v) + '</' + tag + '>';
    if (Array.isArray(v)) return v.map(x => build(x, 'item')).join('');
    return Object.entries(v).map(([k, x]) => build(x, k)).join('');
  };
  const xmlDecl = '<' + '?xml version="1.0" encoding="UTF-8"?' + '>';
  return xmlDecl + '
<' + root + '>
' + build(obj, root) + '
</' + root + '>';
}
function xmlToObj(xml) {
  const doc = new DOMParser().parseFromString(xml, 'text/xml');
  const parse = n => {
    if (!n.children.length) return n.textContent;
    const o = {};
    for (const c of n.children) {
      const k = c.nodeName;
      if (o[k] === undefined) o[k] = parse(c);
      else if (Array.isArray(o[k])) o[k].push(parse(c));
      else o[k] = [o[k], parse(c)];
    }
    return o;
  };
  return parse(doc.documentElement);
}
export async function convData(file, target) {
  const ext = getExt(file.name);
  const text = await readText(file);
  let data;
  if (ext === 'json') data = JSON.parse(text);
  else if (ext === 'csv') data = Papa.parse(text, { header: true }).data;
  else if (ext === 'xml') data = xmlToObj(text);
  else if (ext === 'yaml' || ext === 'yml') data = jsyaml.load(text);
  else if (ext === 'toml') data = TOML.parse(text);
  else throw new Error('不支持的数据格式');

  let out, mime, outExt = target;
  if (target === 'json') { out = JSON.stringify(data, null, 2); mime = 'application/json'; }
  else if (target === 'csv') { out = Papa.unparse(Array.isArray(data) ? data : [data]); mime = 'text/csv'; }
  else if (target === 'xml') { out = toXML(data, 'data'); mime = 'application/xml'; }
  else if (target === 'yaml') { out = jsyaml.dump(data); mime = 'text/yaml'; outExt = 'yaml'; }
  else if (target === 'toml') { out = TOML.stringify(data); mime = 'text/toml'; }
  else throw new Error('不支持的目标格式');

  return new Blob([out], { type: mime + ';charset=utf-8' });
}