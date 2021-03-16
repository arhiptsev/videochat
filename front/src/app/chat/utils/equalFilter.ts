import { filter } from "rxjs/operators";
import { get } from 'lodash';
import { Observable, Subject } from "rxjs";


export const equalFilter = (value: any, path?: string) =>
    filter(inputValue => value === path ? get(inputValue, path) : inputValue);

export const unsubscriber: () => [Observable<void>, () => void] = () => {
    const subj = new Subject<void>();
    return [subj.asObservable(), () => { subj.next(); subj.complete(); }];
}