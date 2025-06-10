import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Chip } from '@heroui/chip';
import { Button } from '@heroui/button';
import { Divider } from '@heroui/divider';
import { useParams } from 'react-router-dom';
import { 
  TbCreditCard, 
  TbTrendingUp, 
  TbCurrencyDollar, 
  TbReceipt,
  TbPlus,
  TbDownload,
  TbRefresh
} from 'react-icons/tb';

import AppLayout from '@/components/layouts/app-layouts/AppLayout';
import AppLayoutBody from '@/components/layouts/app-layouts/AppLayoutBody';

interface WalletData {
  currentBalance: number;
  currency: string;
}

interface Transaction {
  _id: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  createdAt: string;
  status: 'completed' | 'pending' | 'failed';
}

export default function BillingOverviewPage() {
  const { member_id } = useParams();
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for now - replace with actual API calls
    setTimeout(() => {
      setWalletData({
        currentBalance: 15750.00,
        currency: 'NGN'
      });
      
      setTransactions([
        {
          _id: '1',
          amount: 5000,
          type: 'credit',
          description: 'Workspace subscription payment',
          createdAt: '2024-06-10T10:30:00Z',
          status: 'completed'
        },
        {
          _id: '2',
          amount: 2500,
          type: 'debit',
          description: 'API usage charges',
          createdAt: '2024-06-09T15:45:00Z',
          status: 'completed'
        },
        {
          _id: '3',
          amount: 10000,
          type: 'credit',
          description: 'Account top-up',
          createdAt: '2024-06-08T09:20:00Z',
          status: 'completed'
        }
      ]);
      
      setLoading(false);
    }, 1000);
  }, []);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'danger';
      default: return 'default';
    }
  };

  const getTransactionColor = (type: string) => {
    return type === 'credit' ? 'text-success' : 'text-danger';
  };

  if (loading) {
    return (
        <AppLayoutBody>
          <div className="space-y-6">
            <div className="animate-pulse">
              <div className="h-8 bg-content2 rounded mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 bg-content2 rounded-lg"></div>
                ))}
              </div>
              <div className="h-64 bg-content2 rounded-lg"></div>
            </div>
          </div>
        </AppLayoutBody>
    );
  }

  return (
      <AppLayoutBody>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Billing Overview</h1>
              <p className="text-foreground-600">
                Manage your workspace billing and view transaction history
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="bordered"
                startContent={<TbRefresh className="w-4 h-4" />}
                size="sm"
              >
                Refresh
              </Button>
              <Button
                variant="bordered"
                startContent={<TbDownload className="w-4 h-4" />}
                size="sm"
              >
                Export
              </Button>
              <Button
                color="primary"
                startContent={<TbPlus className="w-4 h-4" />}
                size="sm"
              >
                Add Funds
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border border-divider">
              <CardBody className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-default-600 text-sm font-medium">Current Balance</p>
                    <p className="text-2xl font-bold text-foreground">
                      {walletData ? formatCurrency(walletData.currentBalance, walletData.currency) : '--'}
                    </p>
                  </div>
                  <div className="p-3 bg-success/10 rounded-full">
                    <TbCurrencyDollar className="w-6 h-6 text-success" />
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="border border-divider">
              <CardBody className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-default-600 text-sm font-medium">Monthly Usage</p>
                    <p className="text-2xl font-bold text-foreground">₦2,500</p>
                    <p className="text-success text-sm">+12% from last month</p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-full">
                    <TbTrendingUp className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="border border-divider">
              <CardBody className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-default-600 text-sm font-medium">Total Transactions</p>
                    <p className="text-2xl font-bold text-foreground">{transactions.length}</p>
                    <p className="text-default-500 text-sm">This month</p>
                  </div>
                  <div className="p-3 bg-secondary/10 rounded-full">
                    <TbReceipt className="w-6 h-6 text-secondary" />
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Recent Transactions */}
          <Card className="border border-divider">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between w-full">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Recent Transactions</h3>
                  <p className="text-default-600 text-sm">Latest billing activity</p>
                </div>
                <Button variant="light" size="sm">View All</Button>
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              <div className="space-y-4">
                {transactions.map((transaction, index) => (
                  <div key={transaction._id}>
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          transaction.type === 'credit' ? 'bg-success/10' : 'bg-danger/10'
                        }`}>
                          <TbCreditCard className={`w-4 h-4 ${
                            transaction.type === 'credit' ? 'text-success' : 'text-danger'
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{transaction.description}</p>
                          <p className="text-sm text-default-600">{formatDate(transaction.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Chip
                          size="sm"
                          color={getStatusColor(transaction.status)}
                          variant="flat"
                        >
                          {transaction.status}
                        </Chip>
                        <p className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                          {transaction.type === 'credit' ? '+' : '-'}
                          {formatCurrency(transaction.amount, walletData?.currency || 'NGN')}
                        </p>
                      </div>
                    </div>
                    {index < transactions.length - 1 && <Divider />}
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </AppLayoutBody>
  );
}
