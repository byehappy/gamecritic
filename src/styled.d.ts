import 'styled-components';
import {ITheme,ThemeEnum} from './interfaces/styled'
import { GlobalToken } from 'antd';

declare module 'styled-components' {
  export interface DefaultTheme extends ITheme {
    type: ThemeEnum,
    antd:GlobalToken
  }
}