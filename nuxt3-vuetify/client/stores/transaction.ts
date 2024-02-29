
import { defineStore } from "pinia";

const API = 'http://localhost:4000/transaction';

const currentDate = new Date();

export const useTransactionStore = defineStore('transactions', {

    state: () => {
        return {
            tableSelected: ref('monthly'), 
            
            filter: ref(''),
            order: ref('asc'),
            
            day: ref(currentDate.getDay()),
            month: ref(currentDate.getMonth() + 1),
            year: ref(currentDate.getFullYear()),

            expenses: ref([]),
            incomes: ref([]),
            investments: ref([]),
            transactions: ref([]),

            totalByMonthExpenses: ref(''),
            totalByMonthIncomes: ref(''),
            totalByMonthInvestments: ref(''),
            surplus: ref(''),

            // getByYear
            totalExpenses: ref([]), 
            totalIncomes: ref([]), 
            totalInvestments: ref([]),
            
            totalAnnualExpenses: ref(''), 
            totalAnnualIncomes: ref(''), 
            totalAnnualInvestments: ref(''),
            // messages
            messageError: ref(''),
            messageSuccess: ref('')
        };
    },
    
    actions: {
        async create ( transaction: any ) {
            try {
                console.log(transaction);
                if(typeof localStorage !== 'undefined') {
                    const token = localStorage.getItem('token');
                   if(token) {
                   this.messageSuccess = await $fetch(`${API}`, {
                    method: 'POST',
                    headers: {
                        Authorization: token
                    },
                    body: {
                        date: transaction.date,
                        type: transaction.type,
                        description: transaction.description,
                        installment:transaction.installment,
                        total_installments:transaction.total_installments,
                        amount: transaction.amount,
                        category: transaction.category,
                        account: transaction.account,
                        destiny: transaction.destiny,
                        status: transaction.status
                        
                    }
                }); 
                } 
                }

                setTimeout(() => {
                    this.messageSuccess = '';
                },2000);
            } catch (error: any) {
                console.log(error);
                if (error.response._data.message) {
                    this.messageError = error.response._data.message;
                } else {
                    this.messageError = 'Erro ao processar a solicitação.';
                }
                setTimeout(() => {
                    this.messageError = '';
                },2000);
            }
        }, 
        async getByMonth () {
            try {
                if(typeof localStorage !== 'undefined') {
                    const token = localStorage.getItem('token');
                    if(token) {
                    this.transactions = await $fetch(`${API}/${this.order}/${this.year}/${this.month}`, {
                        method: 'GET',
                        headers: {
                            Authorization: token
                        },
                    });
                    } 
                }
                this.expenses = this.transactions.expenses;
                this.incomes = this.transactions.incomes;
                this.investments = this.transactions.investments;

                this.totalByMonthExpenses = this.transactions.totalByMonthExpenses;
                this.totalByMonthIncomes = this.transactions.totalByMonthIncomes;
                this.totalByMonthInvestments = this.transactions.totalByMonthInvestments;
                this.surplus = this.transactions.surplus;

                console.log(this.filter, this.order, this.month, this.year);
            } catch (error) {
                console.log(error);
            }
        },
        async getByYear () {
            try {
                console.log('oi');
                if(typeof localStorage !== 'undefined') {
                    const token = localStorage.getItem('token');
                    if(token) {
                    this.transactions = await $fetch(`${API}/${this.order}/${this.year}`, {
                        method: 'GET',
                        headers: {
                            Authorization: token
                        },
                    });
                    } 
                }
                
                this.totalExpenses = this.transactions.totalExpenses, 
                this.totalIncomes = this.transactions.totalIncomes,
                this.totalInvestments = this.transactions.totalInvestments,
                this.totalAnnualExpenses = this.transactions.totalAnnualExpenses,
                this.totalAnnualIncomes = this.transactions.totalAnnualIncomes,
                this.totalAnnualInvestments = this.transactions.totalAnnualInvestments;
                console.log(this.totalExpenses, this.totalIncomes, this.totalInvestments, this.totalAnnualExpenses);
            } catch (error) {
                console.log(error);
            }
        },
        
        async delete (id: number) {
            try {
                if(typeof localStorage !== 'undefined') {
                    const token = localStorage.getItem('token');
                   if(token) {
                    this.messageSuccess = await $fetch(`${API}/${id}`, {
                        method: 'DELETE',
                        headers: {
                            Authorization: token
                        },
                    });
                } 
                
                }
                console.log('deleteado');
            } catch (error) {
                console.log(error);
            }
        },
        async changeStatus (id: number) {
            try {
                console.log(id);
                if(typeof localStorage !== 'undefined') {
                    const token = localStorage.getItem('token');
                   if(token) {
                    this.messageSuccess = await $fetch(`${API}/${id}`, {
                        method: 'PUT',
                        headers: {
                            Authorization: token
                        },
                    });
                } 
                
                }
                console.log('status atualizado');
            } catch (error) {
                console.log(error);
            }
        }
    }
});