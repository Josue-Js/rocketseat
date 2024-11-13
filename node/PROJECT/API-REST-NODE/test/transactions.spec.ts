import { expect, test, beforeAll, afterAll, it } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { describe } from 'node:test'


describe('', () => {
    beforeAll(async () => {
        await app.ready()
    })
    
    afterAll(async () => {
        await app.close()
    })
    
    it('shoulder be able to create a new transaction', async() => {
    
        await request(app.server).post('/transactions').send({ 
            title: 'New transaction',
            amount: 5000,
            type: 'credit',
        }).expect(201)
    })

    it('shoulder be able to list all transaction', async () => {
        const createTransactionResponse =  await request(app.server).post('/transactions').send({ 
            title: 'New transaction',
            amount: 5000,
            type: 'credit',
        })
        const cookies = createTransactionResponse.get('set-cookie')!


        const listTransaction = await request(app.server)
        .get('/transactions')
        .set('Cookie', cookies)
       

        expect(listTransaction.body.transactions).toEqual([expect.objectContaining({
            title: 'New transaction',
            amount: 5000,
            type: 'credit',
        })])
    })

    it('shoulder be able to get specific all transaction', async () => {
        const createTransactionResponse =  await request(app.server).post('/transactions').send({ 
            title: 'New transaction',
            amount: 5000,
            type: 'credit',
        })
        const cookies = createTransactionResponse.get('set-cookie')!


        const listTransaction = await request(app.server)
        .get('/transactions')
        .set('Cookie', cookies)
       
        const transactionId = listTransaction.body.transactions[0].id
    
        const getTransactionResponse = await request(app.server)
        .get(`/transactions/${transactionId}`)
        .set('Cookie', cookies)

        expect(getTransactionResponse.body.transaction).toEqual(expect.objectContaining({
            title: 'New transaction',
            amount: 5000,
            type: 'credit',
        }))
    })

    it('shoulder be able to get the summary all transaction', async () => {
        const createTransactionResponse =  await request(app.server).post('/transactions').send({ 
            title: 'credit transaction',
            amount: 5000,
            type: 'credit',
        })
        const cookies = createTransactionResponse.get('set-cookie')!

        await request(app.server).post('/transactions')
        .set('Cookie', cookies)
        .send({ 
            title: 'debit transaction',
            amount: 2000,
            type: 'debit',
        })


        const summaryResponse = await request(app.server)
        .get('/transactions/summary')
        .set('Cookie', cookies)
       

        expect(summaryResponse.body.summary).toEqual({
            amount: 7000
        })
    })
})
