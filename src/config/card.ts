import m0 from '@/assets/card/m0.gif';
import m1 from '@/assets/card/m1.gif';
import m2 from '@/assets/card/m2.gif';
import m3 from '@/assets/card/m3.gif';
import m4 from '@/assets/card/m4.gif';
import m5 from '@/assets/card/m5.gif';
import m6 from '@/assets/card/m6.gif';
import m7 from '@/assets/card/m7.gif';
import m8 from '@/assets/card/m8.gif';
import m9 from '@/assets/card/m9.gif';
import p0 from '@/assets/card/p0.gif';
import p1 from '@/assets/card/p1.gif';
import p2 from '@/assets/card/p2.gif';
import p3 from '@/assets/card/p3.gif';
import p4 from '@/assets/card/p4.gif';
import p5 from '@/assets/card/p5.gif';
import p6 from '@/assets/card/p6.gif';
import p7 from '@/assets/card/p7.gif';
import p8 from '@/assets/card/p8.gif';
import p9 from '@/assets/card/p9.gif';
import pai from '@/assets/card/pai.gif';
import pai2 from '@/assets/card/pai2.gif';
import s0 from '@/assets/card/s0.gif';
import s1 from '@/assets/card/s1.gif';
import s2 from '@/assets/card/s2.gif';
import s3 from '@/assets/card/s3.gif';
import s4 from '@/assets/card/s4.gif';
import s5 from '@/assets/card/s5.gif';
import s6 from '@/assets/card/s6.gif';
import s7 from '@/assets/card/s7.gif';
import s8 from '@/assets/card/s8.gif';
import s9 from '@/assets/card/s9.gif';
import z1 from '@/assets/card/z1.gif';
import z2 from '@/assets/card/z2.gif';
import z3 from '@/assets/card/z3.gif';
import z4 from '@/assets/card/z4.gif';
import z5 from '@/assets/card/z5.gif';
import z6 from '@/assets/card/z6.gif';
import z7 from '@/assets/card/z7.gif';

const image = (src: string) => {
    const ret = new Image();
// image.src = seatIndex !== 0 || (direction & 2) === 2 ? pai : cards[card];
    ret.src = src;
    return ret
}
// 0 红5万  1-9 1-9万
// 10 红5筒  11-19 1-9筒
// 20 红5条  21-29 1-9条
// 31-43 东南西北白发中
// 44, 45 牌背
const cards = [
    image(m0), image(m1), image(m2), image(m3), image(m4), image(m5), image(m6), image(m7), image(m8), image(m9),
    image(p0), image(p1), image(p2), image(p3), image(p4), image(p5), image(p6), image(p7), image(p8), image(p9),
    image(s0), image(s1), image(s2), image(s3), image(s4), image(s5), image(s6), image(s7), image(s8), image(s9),
    undefined, image(z1), undefined, image(z2), undefined, image(z3), undefined, image(z4), undefined, image(z5),
    undefined, image(z6), undefined, image(z7), image(pai), image(pai2)
]

export const cardSinge = [1, 2, 3, 4, 5, 6, 7, 8, 9,
    11, 12, 13, 14, 15, 16, 17, 18, 19,
    21, 22, 23, 24, 25, 26, 27, 28, 29,
    31, 33, 35, 37, 39, 41, 43]

// 初始化牌库
export const cardLib = [
    [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 9,
        11, 11, 11, 11, 12, 12, 12, 12, 13, 13, 13, 13, 14, 14, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19,
        21, 21, 21, 21, 22, 22, 22, 22, 23, 23, 23, 23, 24, 24, 24, 24, 25, 25, 25, 25, 26, 26, 26, 26, 27, 27, 27, 27, 28, 28, 28, 28, 29, 29, 29, 29,
        31, 31, 31, 31, 33, 33, 33, 33, 35, 35, 35, 35, 37, 37, 37, 37, 39, 39, 39, 39, 41, 41, 41, 41, 43, 43, 43, 43]
]

export default cards;
