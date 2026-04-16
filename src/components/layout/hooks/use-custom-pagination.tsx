import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useMemo } from "react"

export default function useCustomPagination(){
    const router = useRouter()
    const pathName = usePathname()
    const searchParams = useSearchParams()

    const currentPage = useMemo(()=>{
      console.log("search params ", searchParams)
      return searchParams ? Number(searchParams.get("page")) || 1 : 1
    },[searchParams])


    const onPageChange = (page:number)=>{
      router.push(`${pathName}?page=${page}`)
    }   

    return{
        currentPage,
        onPageChange,
        pathName
    }
}