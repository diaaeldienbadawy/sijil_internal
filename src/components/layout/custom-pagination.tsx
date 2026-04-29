import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"
import useCustomPagination from "./hooks/use-custom-pagination"


interface Props{
  totalPages:number
  currentPage:number
  path:string
}

export default function CustomPagination({ totalPages }:Props){
    const {onPageChange,currentPage,pathName} = useCustomPagination()
    return(
      <div className="p-5">
        <Pagination>
          <PaginationContent className="flex flex-wrap">
            <PaginationItem  className="pagination-link previous" aria-disabled={currentPage === 1} onClick={()=>onPageChange(Math.max(1, currentPage - 1))} >
                السابق
            </PaginationItem>
            <Content totalPages={totalPages} path={pathName} currentPage={currentPage} onPageChange={onPageChange}/>
            <PaginationItem  className="pagination-link next" aria-disabled={currentPage === totalPages} onClick={()=>onPageChange(Math.min(totalPages, currentPage + 1))} >
                التالى
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    )
}

interface ContentProps extends Props {
  onPageChange: (page: number) => void
}

const Content = ({totalPages, currentPage , onPageChange}: ContentProps)=>{
  console.log("current page ", currentPage)


  return totalPages <= 3 ? (
    <CountedPages totalPages={totalPages} currentPage={currentPage} onPageChange={onPageChange}/>
  ):(
    <EllipsisPages totalPages={totalPages}  currentPage={currentPage} onPageChange={onPageChange}/>
  )
}

const CountedPages = ({totalPages, currentPage, onPageChange}:{totalPages:number, currentPage:number, onPageChange:(page:number)=>void})=>{
  return(
    <>
    {Array.from({ length: totalPages }, (_, i) => (
      <PaginationItem
        className={`pagination-link internal-link ${currentPage === i + 1 ? 'active' : ''}`}
        key={i + 1}
        onClick={()=>onPageChange(i + 1)}
        aria-current={currentPage === i + 1 ? "page" : undefined}
      >
        {i + 1}
      </PaginationItem>
    ))}
    </>
  )
}

const EllipsisPages = ({totalPages,  currentPage, onPageChange}:{totalPages:number, currentPage:number, onPageChange:(page:number)=>void})=>{
  
  const length = currentPage == 3 || (currentPage == totalPages - 2) ? 4 : 3

  const initialIndex = (index:number, currentPage:number, totalPages:number ,length:number)=>{
    const inBeginning = currentPage <= 3

    if(currentPage == 1 ) return index
    if(currentPage == 2 ) return index + 1
    if(currentPage == totalPages ) return totalPages - 3 + index
    if(currentPage == totalPages - 1 ) return totalPages - 3 + index
    if(currentPage == totalPages - 2 ) return totalPages - 3 + index -1
    return currentPage - 2 - ( length - 3 ) + index  
  }

  return(
    <>
    {
      currentPage - 2 > 1 ? (
        <>
          <PaginationItem
            className={`pagination-link internal-link `}
            key={`page=${1}`}  
            onClick={()=>onPageChange(1)}
            aria-current={currentPage === 1 ? "page" : undefined}
          >
            {1}
          </PaginationItem>
          <div className="pagination-link internal-link">...</div>   
        </>
      ):null
    }
    {
      Array.from({length: length },(_,i)=>initialIndex(i, currentPage, totalPages, length)).map(page=>(
        <PaginationItem
          className={`pagination-link internal-link ${currentPage === page + 1 ? 'active' : ''}`}
          key={`page=${page + 1}`}  
          onClick={()=>onPageChange(page+1)}
          aria-current={currentPage === page ? "page" : undefined}
        >
          {page + 1}
        </PaginationItem>
      ))
    }
    {
      currentPage + 2 < totalPages ? (
        <>
          <div className="pagination-link internal-link">...</div>
          <PaginationItem
            className={`pagination-link internal-link `}
            key={`page=${totalPages}`}  
            onClick={()=>onPageChange(totalPages)}
            aria-current={currentPage === totalPages ? "page" : undefined}
          >
            {totalPages}
          </PaginationItem>
        </>
      ):null
    }
    </>
  )
}