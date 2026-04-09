import { Card } from "@/components/ui/card";
import useLoginCard from "./use-login-card";
import LayersIcon from "@/components/svg-icons/layers-icon";
import LabeledInput from "@/components/form/labeled-input";
import FormButton from "@/components/form/from-button";

export default function LoginCard(){
    const {
        username,
        password,
        remember,
        error,
        setUserName,
        setPassword,
        setRemember,
        loginAction,
        clearError
    } = useLoginCard()

    return(
        <div className="p-1 m-auto">
            <Card className="min-w-[250px] sm:min-w-[440px] w-full bg-paper p-0 shadow-deep gab-0 rounded-3xl">
                <div className="chess-bg p-6 bg-primary h-[50%] min-h-[250px]">
                    <div className="w-full p-6 flex justify-center">
                        <div className="rounded-full flex p-3 bg-gold w-[85px] h-[85px]">
                            <LayersIcon/>
                        </div>
                    </div>
                    <div className="w-full py-4 flex justify-center text-center">
                        <h2 className="text-paper font-amiri">نظام البحث</h2>
                    </div>
                </div>
                <div className="bg-paper py-5">
                    <div className="text-red-500 py-2 font-tajawal text-center">
                        <h5>{error}</h5>
                    </div>
                    <LabeledInput lable="اسم المستخدم" placeholder="ادخل اسم المستخدم" value={username} setValue={setUserName} />
                    <LabeledInput lable="كلمة السر" placeholder="ادخل كلمة السر" type="password" value={password} setValue={setPassword} />
                    <LabeledInput dir="horizontal" lable="تذكرني" type="checkbox" checked={remember} setChecked={setRemember} />
                    <div className="py-6">
                        <FormButton varient="default" size="xxxl" className="text-paper text-xl rounded-xl" text="تسجيل دخول" action={loginAction} />
                    </div>
                </div>
                <div className="flex bg-cream p-5 border border-t-gray-300">
                    <div className="m-auto text-primary-light">
                    © نظام البحث
                    </div> 
                </div>
            </Card>
        </div>

    )
}