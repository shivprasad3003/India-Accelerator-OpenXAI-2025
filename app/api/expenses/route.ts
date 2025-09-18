import { NextResponse } from "next/server";

let expenses: { id: number; title: string; amount: number; date: string }[] = [];
let idCounter = 1;

export async function GET() {
  return NextResponse.json(expenses);
}

export async function POST(req: Request) {
  try {
    const { title, amount, date } = await req.json();

    const newExpense = {
      id: idCounter++,
      title,
      amount,
      date: date || new Date().toISOString(),
    };

    expenses.push(newExpense);

    return NextResponse.json(newExpense, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid expense format" },
      { status: 400 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    expenses = expenses.filter((expense) => expense.id !== id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid delete request" },
      { status: 400 }
    );
  }
}
