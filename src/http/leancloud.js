import AV from 'leancloud-storage'
AV.init({ appId: 'XYTDmQXhoooKer5qMieknSWe-gzGzoHsz', appKey: 'i4iSvy15NLX0oACNMalo7M0b' })

class Leancloud {
    constructor(className) {
        this.className = className
    }

    create(data, dependentClassName, dependentId) {
        if (!data) { return Promise.reject('必须提供data') }
        if (typeof data !== 'object') {
            return Promise.reject('参数必须为非空对象')
        }
        let entries = Object.entries(data)
        let instance = new AV.Object(this.className)
        if (dependentClassName && dependentId) {
            let dependentInstance = AV.Object.createWithoutData(dependentClassName, dependentId)
            instance.set('dependent', dependentInstance)
        }
        entries.forEach(array => {
            instance.set(array[0], array[1])
        })
        return instance.save()
    }

    fetchAll() {
        let query = new AV.Query(this.className)
        return query.find()
    }

    update(data, id) {
        if (!data || !id) { return Promise.reject('必须提供data和id') }
        if (typeof data !== 'object') {
            return Promise.reject('参数必须为非空对象')
        }
        let entries = Object.entries(data)
        let instance = AV.Object.createWithoutData(this.className, id)
        entries.forEach(array => {
            instance.set(array[0], array[1])
        });
        return instance.save()
    }

    destroy(id) {
        if (!id) { return Promise.reject('必须提供id') }
        let instance = AV.Object.createWithoutData(this.className, id)
        return instance.destroy()
    }
}

export default Leancloud