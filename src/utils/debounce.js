// 防抖函数
export function debounce(fn, wait, flag) {
  let timer = null;
  wait = wait || 600;
  return function () {
    let that = this;
    if (flag == true){// 立即执行
      fn.apply(that);
      flag = false;
    }else{// 延时执行
      if (timer !== null) clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(that);
      }, wait);
    }
  }
}
