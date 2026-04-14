export class DateTimeHelper{
    static parseRemainingTime(text:string|undefined):{days:number;hours:number;urgent:boolean}|null {
      if(!text) return null;
      const dM=text.match(/(\d+)\s*يوم/); const hM=text.match(/(\d+)\s*ساع/);
      const days=dM?parseInt(dM[1]):0; const hours=hM?parseInt(hM[1]):0;
      return {days,hours,urgent:days<3};
    }
}