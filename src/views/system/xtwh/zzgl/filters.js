export const isNull = (date) => {
    if (!date) return true
    if (JSON.stringify(date) === '{}') return true
    if (JSON.stringify(date) === '[]') return true
}

// beTree
 //将数组数据转换为树型数据
export const beTree = (list) => {
    let data = list.filter(father => {
       let branchArr =  list.filter(child => child.sjbh == father.bh)//返回每一项的子级数组
       branchArr.length >0 ?father.children = branchArr : ''//如果存在子级，则给父级添加一个children属性，并赋值
       return father.sjbh == 0 ; // 返回第一层
    });
    return data
}

