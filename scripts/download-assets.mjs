import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const outDir = path.join(root, 'assets', 'images');

const assets = [
  {
    name: 'tati-retrato.jpg',
    url: 'https://scontent.cdninstagram.com/v/t51.71878-15/715360154_976200781880675_1913203622283125147_n.jpg?stp=cmp1_dst-jpg_e35_s640x640_tt6&_nc_cat=108&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiQ0xJUFMuYmVzdF9pbWFnZV91cmxnZW4uQzMifQ%3D%3D&_nc_ohc=KW1L8YAunmUQ7kNvwGsw6ZR&_nc_oc=AdoC_we662x2guDIcBqZjKQVBE4kgnvmZamXihDBZHkS_IHx5Gi45CI2Nv9XJ65guBU&_nc_zt=23&_nc_ht=scontent.cdninstagram.com&_nc_gid=2cMN7a1cQq7eB0_qmM8jcg&_nc_ss=7b689&oh=00_Af8G-lHJjVo_qEfZIUs1qM5-8JzOwDso99lq1-QVnT0YFQ&oe=6A4384CD',
  },
  {
    name: 'tati-palco-sonora.jpg',
    url: 'https://scontent.cdninstagram.com/v/t51.82787-15/612813421_18298850545260663_6190278921622877883_n.heic?stp=c192.0.576.576a_dst-jpg_e35_s640x640_tt6&_nc_cat=102&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiQ0FST1VTRUxfSVRFTS5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_ohc=0f5HXUXq7isQ7kNvwE2j9E-&_nc_oc=Adr2I95VR8stIjB39RdciQq4EzYf0abOKfxRY13cTDrq2c4pIB_Y0BL-sBa_PRs6YEg&_nc_zt=23&_nc_ht=scontent.cdninstagram.com&_nc_gid=cEN666ZsBC9-WRx3eDI-xg&_nc_ss=7b689&oh=00_Af_osCm7aWoRze1HwUngRJvFQSUbAcS4xrPE4Zuc2z64qw&oe=6A4365CA',
  },
];

fs.mkdirSync(outDir, { recursive: true });

for (const asset of assets) {
  try {
    const res = await fetch(asset.url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const dest = path.join(outDir, asset.name);
    fs.writeFileSync(dest, buf);
    console.log('OK', asset.name, buf.length, 'bytes');
  } catch (err) {
    console.warn('FAIL', asset.name, err.message);
  }
}
