// import cron from 'node-cron'

import { RankType, DefaultErrorType, OriginRankType, ProductInfoType, AjaxResType } from "@/lib/globalts";

import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma';


interface GetProductArgus {
  type?: string;
  bigType?: string;
  currentPageIndex?: number;
  pageNum?: number;
  keyword?: string;
}

interface ProductListResType {
  list: OriginRankType[];
  currentPageIndex: number;
  pageTotal: number;
  pageNum: number;
}


type ResponseData = {
  code: number
  message: string
  data: any
}

export const getProductListData = async ({
}: GetProductArgus): Promise<AjaxResType<ProductListResType, DefaultErrorType>> => {
  const res = await fetch(`https://dianshi.weibo.com/vote_rank?page=1&c=applet&gsid=_2A25Lt1JsDeRxGeFH6VYU8y_JzDuIHXVm5eKkrDV6PUJbkdAbLU_GkWpNe7SD702DdMphQLjBGIusZINmEoeXNV7E&ts=1723040087&pagesize=15&current_uid=7924531577&version=2&sign=7d83808b4d28ead059d0b77355d183e75199082f&tid=1214&cid=1078`);
  const repo = await res.json()
  console.log('res', repo);
  return repo;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // const products = await prisma.$queryRaw`SELECT * FROM Product`
  // const type = Number(req.query.type);
  // const bigType = Number(req.query.bigType);
  // const pageNum = Number(req.query.pageNum);
  // const pageIndex = Number(req.query.currentPageIndex);
  // const keyword = String(req.query.keyword);
  // const {userid} = req.cookies;
  // let products = [];
  
  //   const products = await prisma.rank.findMany();
  const data_res = await getProductListData({});
  const result = [];

  if(data_res.code === 1000) {
    const data = data_res.data;
    const list = data?.list;
    if (list && list.length) {
      for (let i =0 ;i<list?.length; i++) {
        let item = list[i];
        let res: RankType = {} as any;
        const { ranking, type, id, name, vote_button_below_text, share_vote_show_text} = item;
        const { cover, desc, desc2, detail_url} = item.show_data;
        res.ranking = ranking;
        res.type = type;
        res.wb_id = id;
        res.name = name;
        res.cover = cover;
        res.desc = desc;
        res.desc2 = desc2;
        res.detail_url = detail_url;
        res.vote_button_below_text = vote_button_below_text;
        res.share_vote_show_text = share_vote_show_text;

        const decodeVote = decodeURIComponent(vote_button_below_text);
        const tmp1 = decodeVote.split("<b>");
        const tmp2 = tmp1[1].split("</b>");
        let vote_num = 0;
        if (tmp2[0].includes('w')) {
          var dd = tmp2[0].split('w');
          vote_num = Number(dd[0]) * 10000;
        } else {
          vote_num = Number(tmp2[0])
        }
        res.vote_num = vote_num;
        result.push(res);
      }
    }

    console.log('res-------', result);


    for (const post of result) {
      await prisma.rank.create({
        data: post,
      });
    }
  

  }

  // const schedule = '* * * * *' // Run every minute

  // const job = () => {
  //   console.log('Scheduled job is running every minute...')
  // }

  // cron.schedule(schedule, job)


  res.status(200).json({
    code: 0,
    message: 'success!',
    data: {
      list: [],
      // mainlist: products,
      // newlist: products,
    },
  });

}