import { ProductType, DefaultErrorType, ProductColorType, ProductInfoType, AjaxResType } from "@/lib/globalts";

interface GetProductArgus {
  type?: string;
  bigType?: string;
  currentPageIndex: number;
  pageNum: number;
  keyword: string;
}

interface ProductListResType {
  list: ProductInfoType[];
  currentPageIndex: number;
  pageTotal: number;
  pageNum: number;
}


export const getProductListData = async ({
}: GetProductArgus): Promise<AjaxResType<ProductListResType, DefaultErrorType>> => {
  const res = await fetch(`https://dianshi.weibo.com/vote_rank?page=1&c=applet&gsid=_2A25Lt1JsDeRxGeFH6VYU8y_JzDuIHXVm5eKkrDV6PUJbkdAbLU_GkWpNe7SD702DdMphQLjBGIusZINmEoeXNV7E&ts=1723040087&pagesize=15&current_uid=7924531577&version=2&sign=7d83808b4d28ead059d0b77355d183e75199082f&tid=1214&cid=1078`);
  const repo = await res.json()
  console.log('res', repo);
  return repo;
}