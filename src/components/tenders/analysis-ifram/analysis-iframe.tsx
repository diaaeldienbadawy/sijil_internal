import { IframeHTMLAttributes, useEffect, useRef } from "react"

export default function AnalysisIframe(){

    const ref = useRef<HTMLIFrameElement>(null)

    return(<iframe ref={ref} title="tenders analysis" width="1140" height="541.25" src="https://app.powerbi.com/view?r=eyJrIjoiYjA1OWY3ZDgtZWZkMS00YjkwLTkzYzUtYzU4MWZhNDhkYzVmIiwidCI6IjA5ZTJhMmY0LTNmYWUtNGY1OS1iOGU5LTAyZDlmNGI4MTlkZSIsImMiOjl9" allowFullScreen></iframe>)
}