"use client";

import Link from "next/link";
import customersData from "@/data/customers.json";

function getAge(dob: string) {
  return Math.floor((Date.now() - new Date(dob).getTime()) / (1000 * 60 * 60 * 24 * 365.25));
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Client Control Matrix</h1>
            <p className="text-xs text-gray-500">Select a verified account folder to initiate search engine matching arrays.</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl bg-white border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Client Profile</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Location Context</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Matrimonial Stage</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Pipeline Status</th>
                <th className="relative px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white text-sm">
              {customersData.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50/70 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-semibold text-gray-900">{customer.firstName} {customer.lastName}</div>
                    <div className="text-xs text-gray-400 capitalize">{customer.gender} • {getAge(customer.dateOfBirth)} yrs</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    <div>{customer.city}</div>
                    <div className="text-xs text-gray-400">{customer.country}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 capitalize">
                    {customer.maritalStatus.replace("_", " ")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide border ${
                      customer.status === "active" ? "bg-green-50 text-green-700 border-green-200" :
                      customer.status === "on_hold" ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                      "bg-gray-50 text-gray-700 border-gray-200"
                    }`}>
                      {customer.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                    <Link 
                      href={`/customer/${customer.id}`} 
                      className="inline-flex rounded bg-black px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800 transition"
                    >
                      Process Matches
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}