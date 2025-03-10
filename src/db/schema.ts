import { sql } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const departments = sqliteTable("departments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
});

export const metrics = sqliteTable("metrics", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  value: real("value").notNull(),
  percentage: real("percentage").notNull(),
  color: text("color").notNull(),
  year: integer("year").notNull(),
});

export const monthlyMetrics = sqliteTable("monthly_metrics", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  metricId: integer("metric_id").notNull().references(() => metrics.id),
  month: text("month").notNull(),
  value: real("value").notNull(),
  percentage: real("percentage").notNull(),
  year: integer("year").notNull(),
});

export const profitData = sqliteTable("profit_data", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  departmentId: integer("department_id").notNull().references(() => departments.id),
  grossProfitActual: real("gross_profit_actual").notNull(),
  grossProfitIndex: real("gross_profit_index").notNull(),
  grossProfitCompletionRate: real("gross_profit_completion_rate").notNull(),
  netProfitActual: real("net_profit_actual").notNull(),
  netProfitIndex: real("net_profit_index").notNull(),
  netProfitCompletionRate: real("net_profit_completion_rate").notNull(),
  year: integer("year").notNull(),
});

export const monthlyProfitData = sqliteTable("monthly_profit_data", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  departmentId: integer("department_id").notNull().references(() => departments.id),
  month: text("month").notNull(),
  grossProfitActual: real("gross_profit_actual").notNull(),
  grossProfitIndex: real("gross_profit_index").notNull(),
  grossProfitCompletionRate: real("gross_profit_completion_rate").notNull(),
  netProfitActual: real("net_profit_actual").notNull(),
  netProfitIndex: real("net_profit_index").notNull(),
  netProfitCompletionRate: real("net_profit_completion_rate").notNull(),
  year: integer("year").notNull(),
});

export const annualProfitData = sqliteTable("annual_profit_data", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  departmentId: integer("department_id").notNull().references(() => departments.id),
  thisYear: real("this_year").notNull(),
  target: real("target").notNull(),
  lastYear: real("last_year").notNull(),
  year: integer("year").notNull(),
});

export const monthlyChartData = sqliteTable("monthly_chart_data", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  departmentId: integer("department_id").notNull().references(() => departments.id),
  month: text("month").notNull(),
  thisYear: real("this_year").notNull(),
  target: real("target").notNull(),
  lastYear: real("last_year").notNull(),
  year: integer("year").notNull(),
});

export const financialMetrics = sqliteTable('financial_metrics', {
  id: integer('id').primaryKey(),
  month: text('month').notNull(),
  year: integer('year').notNull(),
  workingCapital: integer('working_capital').notNull(),
  currentRatio: real('current_ratio').notNull(),
  quickRatio: real('quick_ratio').notNull(),
  cashFlowRatio: real('cash_flow_ratio').notNull(),
  cash: integer('cash').notNull(),
  accountsReceivable: integer('accounts_receivable').notNull(),
  inventory: integer('inventory').notNull(),
  prepaidExpenses: integer('prepaid_expenses').notNull(),
  accountsPayable: integer('accounts_payable').notNull(),
  creditCardDebit: integer('credit_card_debit').notNull(),
  bankOperatingCredit: integer('bank_operating_credit').notNull(),
  accruedExpenses: integer('accrued_expenses').notNull(),
  taxesPayable: integer('taxes_payable').notNull(),
});

export const budgetVariance = sqliteTable('budget_variance', {
  id: integer('id').primaryKey(),
  month: text('month').notNull(),
  year: integer('year').notNull(),
  amount: integer('amount').notNull(),
  type: text('type').notNull(), // 'positive' or 'negative'
});

export const vendorPayments = sqliteTable('vendor_payments', {
  id: integer('id').primaryKey(),
  month: text('month').notNull(),
  year: integer('year').notNull(),
  errorRate: real('error_rate').notNull(),
}); 