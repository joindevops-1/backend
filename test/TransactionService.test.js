// test/TransactionService.test.js
const chai = require('chai');
const sinon = require('sinon');
const mysql = require('mysql2');
const { expect } = chai;

const transactionService = require('../TransactionService');
const dbcreds = require('../DbConfig');

describe('TransactionService', () => {
    let connection;

    beforeEach(() => {
        connection = sinon.stub(mysql, 'createConnection').returns({
            query: sinon.stub(),
            end: sinon.stub()
        });
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should add a transaction successfully', () => {
        const queryStub = connection().query;
        queryStub.yields(null, { affectedRows: 1 });

        const result = transactionService.addTransaction(100, 'Test Transaction');
        expect(result).to.equal(200);
        expect(queryStub.calledOnce).to.be.true;
    });

    it('should get all transactions successfully', (done) => {
        const queryStub = connection().query;
        const mockResults = [{ id: 1, amount: 100, description: 'Test Transaction' }];
        queryStub.yields(null, mockResults);

        transactionService.getAllTransactions((results) => {
            expect(results).to.deep.equal(mockResults);
            done();
        });

        expect(queryStub.calledOnce).to.be.true;
    });

    it('should find a transaction by ID successfully', (done) => {
        const queryStub = connection().query;
        const mockResult = [{ id: 1, amount: 100, description: 'Test Transaction' }];
        queryStub.yields(null, mockResult);

        transactionService.findTransactionById(1, (result) => {
            expect(result).to.deep.equal(mockResult);
            done();
        });

        expect(queryStub.calledOnce).to.be.true;
    });

    it('should delete all transactions successfully', (done) => {
        const queryStub = connection().query;
        queryStub.yields(null, { affectedRows: 1 });

        transactionService.deleteAllTransactions((result) => {
            expect(result.affectedRows).to.equal(1);
            done();
        });

        expect(queryStub.calledOnce).to.be.true;
    });

    it('should delete a transaction by ID successfully', (done) => {
        const queryStub = connection().query;
        queryStub.yields(null, { affectedRows: 1 });

        transactionService.deleteTransactionById(1, (result) => {
            expect(result.affectedRows).to.equal(1);
            done();
        });

        expect(queryStub.calledOnce).to.be.true;
    });
});
