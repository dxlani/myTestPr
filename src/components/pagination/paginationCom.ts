import { VueComponent, Prop, Watch } from 'vue-typescript'


var events = require('events');
var eventEmitter = new events.EventEmitter;


@VueComponent({
    template: require('./pagination.html'),
    style:require('./pagination.scss')
})

export class paginationCom extends Vue {
    
@Prop
  total = 0;
  paginationPageSizes= [10, 20, 30];
  pageSize:number=0;
  pageIndex:number = 1;  
  pageTotal:number=1;

  
  
ready(){
  var routerName = this.$route.path;
  if(window.localStorage.getItem(String(routerName + 'Page'))){
      let pageData = JSON.parse(window.localStorage.getItem(String(routerName + 'Page')));
      this.pageSize = pageData.count;
      this.pageIndex = pageData.currentPage;
  }else{
    this.pageSize = this.paginationPageSizes[0];
    this.pageIndex = 1;
  }
  this.$on('reset',()=>{
      this.pageIndex=1;    
  });
  this.$on('changeCurrentPage',(data)=>{
    this.pageIndex = data.currentPage;
    this.onPageIndexChange(this.pageIndex);
  })
  //this.getTotalPage();
}

@Watch('total')
reset(){
  this.getTotalPage()
}


  //跳转第一页
  skipFirst() {
    if (this.pageIndex !== 1) {
      this.pageIndex = 1;
      this.onPageIndexChange(1);
    }
  }
  //最后一页
  skipLast() {
   const last = Math.max(this.getTotalPage(), 1);
   if (this.pageIndex !== last) {
      this.pageIndex = last;
      this.onPageIndexChange(last);
    }
  }

  //上一页
  skipPrev() {
    if (this.hasPrev()) {
      this.pageIndex = this.pageIndex - 1; 
      this.onPageIndexChange(this.pageIndex);
    }
  }

  //下一页
  skipNext(){
     if (this.hasNext()) {
       this.pageIndex = this.pageIndex + 1; 
      this.onPageIndexChange(this.pageIndex);
    }
  }


  //一页显示多少行
  skipCount() {
    if (this.pageIndex > this.getTotalPage()) {
      this.pageIndex = 1;
    }
    this.onPageIndexChange(this.pageIndex);
  }

  changePageSize() {
    this.getTotalPage();
    this.pageIndex = 1;
    this.onPageIndexChange(1);
  }
  
  onPageIndexChange(pageIndex: number) {
    this.getTotalPage();
    this.$dispatch('pageIndexChange', {pageIndex:(pageIndex-1)*this.pageSize,pageSize:Number(this.pageSize),currentPage:pageIndex});
    // this.pageIndexChange.emit({
    //     pageIndex:(pageIndex-1)*this.pageSize,
    //     pageSize:Number(this.pageSize)
    // });
  }

  // ngOnChanges() {
  //     this.pageSize = this.paginationPageSizes[0];
  //     this.totalPage = this.getTotalPage();
  //     this.pageIndex = Math.max(Math.min(this.pageIndex, this.totalPage), 1);
  // }


  //获取总页数
  getTotalPage(): number {
    //总条数/当前页显示条数=总页数
    this.pageTotal = Math.ceil(this.total / this.pageSize);
    return Math.ceil(this.total / this.pageSize);
  }

  hasNext(): boolean {
    // this.totalPage = this.getTotalPage();
    this.pageIndex = Math.max(Math.min(this.pageIndex, this.getTotalPage()), 1);
    return this.pageIndex < this.getTotalPage();
  }
  hasPrev(): boolean {
    return this.pageIndex > 1;
  }


} 
