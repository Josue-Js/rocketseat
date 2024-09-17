import { Readable } from 'node:stream'



class OneToHundredStream extends Readable {

    _read(){
        const index = this.index++

        setTimeout(() => {
            if(index > 5) {
                this.push(null)
            } else {
                const buffer = Buffer.from(String(index))
                this.push(buffer)
            }
        }, 1000)
    }

}


fetch('http://localhost:3334', {
    method: 'POST',
    body: new OneToHundredStream(),
    duplex: 'half'
}).then(response => response.text()).then(data => console.log(data))