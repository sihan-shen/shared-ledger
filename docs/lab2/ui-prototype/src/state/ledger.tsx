import { createContext, useContext, useReducer, type ReactNode } from "react";
import {
  createDemoState,
  currentMemberId,
  type LedgerState,
  type Transaction,
} from "@/data/demo";

type Action =
  | { type: "add"; transaction: Transaction }
  | { type: "review"; id: string; approved: boolean; note: string }
  | { type: "confirm"; id: string }
  | { type: "dismiss" }
  | { type: "reset" };

// Only a browser-memory UI demonstration; production rules belong on the server.
function reconcileRepayments(state: LedgerState): LedgerState {
  const reserved: Record<string, number> = {};
  for (const repayment of state.repayments) {
    if (repayment.status !== "pending") continue;
    reserved[repayment.from] =
      (reserved[repayment.from] ?? 0) + repayment.amount;
    reserved[repayment.to] = (reserved[repayment.to] ?? 0) + repayment.amount;
  }
  return {
    ...state,
    repayments: state.repayments.map((repayment) => {
      if (repayment.status !== "pending") return repayment;
      const debt = -(state.balances[repayment.from] ?? 0);
      const credit = state.balances[repayment.to] ?? 0;
      return debt <= 0 ||
        credit <= 0 ||
        reserved[repayment.from] > debt ||
        reserved[repayment.to] > credit
        ? { ...repayment, status: "revoked" as const }
        : repayment;
    }),
  };
}

function reducer(state: LedgerState, action: Action): LedgerState {
  switch (action.type) {
    case "reset":
      return createDemoState();
    case "dismiss":
      return { ...state, notice: null };
    case "add":
      return {
        ...state,
        transactions: [action.transaction, ...state.transactions],
        notice: "已提交审核。待审核账目不计入正式预算与余额。",
      };
    case "review": {
      const transaction = state.transactions.find(
        (item) => item.id === action.id,
      );
      if (
        !transaction ||
        transaction.status !== "pending" ||
        transaction.payerId === currentMemberId
      )
        return state;
      if (!action.approved && !action.note.trim()) return state;
      const balances = { ...state.balances };
      if (action.approved) {
        balances[transaction.payerId] += transaction.amount;
        for (const allocation of transaction.allocations)
          balances[allocation.memberId] -= allocation.cents;
      }
      return reconcileRepayments({
        ...state,
        balances,
        budgetUsed:
          state.budgetUsed + (action.approved ? transaction.amount : 0),
        transactions: state.transactions.map((item) =>
          item.id === action.id
            ? {
                ...item,
                status: action.approved ? "approved" : "rejected",
                reviewNote: action.note.trim(),
              }
            : item,
        ),
        notice: action.approved
          ? "审核通过，演示预算与成员余额已更新。失效的待确认还款已自动撤销。"
          : "已驳回，审核意见已记录。",
      });
    }
    case "confirm": {
      const repayment = state.repayments.find((item) => item.id === action.id);
      if (
        !repayment ||
        repayment.status !== "pending" ||
        repayment.to !== currentMemberId
      )
        return state;
      return reconcileRepayments({
        ...state,
        balances: {
          ...state.balances,
          [repayment.from]: state.balances[repayment.from] + repayment.amount,
          [repayment.to]: state.balances[repayment.to] - repayment.amount,
        },
        repayments: state.repayments.map((item) =>
          item.id === action.id ? { ...item, status: "confirmed" } : item,
        ),
        notice: "已确认收款，演示余额已更新。此原型不执行真实转账。",
      });
    }
  }
}

const LedgerContext = createContext<{
  state: LedgerState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function LedgerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, createDemoState);
  return (
    <LedgerContext.Provider value={{ state, dispatch }}>
      {children}
    </LedgerContext.Provider>
  );
}

export function useLedger() {
  const context = useContext(LedgerContext);
  if (!context) throw new Error("useLedger must be used inside LedgerProvider");
  return context;
}
