import Enum from './../../components/enum.js';

export default class DataMode extends Enum{}

DataMode.table = new DataMode('table');
DataMode.individualColumns = new DataMode('individualColumns');