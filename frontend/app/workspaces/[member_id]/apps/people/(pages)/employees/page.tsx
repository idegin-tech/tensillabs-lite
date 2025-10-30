"use client";

import React, { useState } from "react";
import AppBody from '@/components/layout/app-layout/AppBody';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TbPlus, TbChevronLeft, TbChevronRight } from 'react-icons/tb';
import { Employee } from '@/types/employee.types';
import Link from 'next/link';

const mockEmployees: Employee[] = [
	{
		_id: '1',
		firstName: 'Jane',
		lastName: 'Doe',
		email: 'jane.doe@example.com',
		jobTitle: 'Product Manager',
		department: 'Product',
		phone: '+2348012345678',
		gender: 'female',
		workLocation: 'Lagos',
		hireDate: '2022-03-01',
		employeeId: 'EMP001',
		passportPhoto: '',
		status: 'active',
	},
	{
		_id: '2',
		firstName: 'John',
		lastName: 'Smith',
		email: 'john.smith@example.com',
		jobTitle: 'Software Engineer',
		department: 'Engineering',
		phone: '+2348098765432',
		gender: 'male',
		workLocation: 'Abuja',
		hireDate: '2023-01-15',
		employeeId: 'EMP002',
		passportPhoto: '',
		status: 'active',
	},
];

export default function EmployeesPage() {
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);

	const totalEmployees = mockEmployees.length;
	const totalPages = Math.ceil(totalEmployees / itemsPerPage);

	const paginatedEmployees = mockEmployees.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	const handlePageChange = (direction: 'next' | 'prev') => {
		if (direction === 'next' && currentPage < totalPages) {
			setCurrentPage(currentPage + 1);
		} else if (direction === 'prev' && currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	return (
		<AppBody>
			<div className="space-y-8 container mx-auto py-6">
				<div className="flex justify-between items-center pb-4 border-b">
					<h1 className="text-3xl font-bold tracking-tight text-foreground">Employees</h1>
					<Button className="flex items-center gap-2">
						<TbPlus className="h-4 w-4" />
						Create Employee
					</Button>
				</div>

				<div className="flex justify-between items-center mb-4">
					<Input
						placeholder="Search employees..."
						className="w-1/3"
					/>
					<Select
						value={itemsPerPage.toString()}
						onValueChange={(value) => setItemsPerPage(Number(value))}
					>
						<SelectTrigger className="w-32">
							<SelectValue placeholder="Items per page" />
						</SelectTrigger>
						<SelectContent>
							{[10, 20, 30, 50].map((size) => (
								<SelectItem key={size} value={size.toString()}>
									{size} per page
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Avatar</TableHead>
							<TableHead>Name</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Job Title</TableHead>
							<TableHead>Department</TableHead>
							<TableHead>Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{paginatedEmployees.map((employee) => (
							<TableRow key={employee._id}>
								<TableCell>
									<Avatar className="h-10 w-10">
										<AvatarImage src={employee.passportPhoto || undefined} alt={employee.firstName} />
										<AvatarFallback>
											{employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
										</AvatarFallback>
									</Avatar>
								</TableCell>
								<TableCell>
									<Link href={`/workspaces/[member_id]/apps/people/employees/66255`} className="hover:underline">
										{employee.firstName} {employee.lastName}
									</Link>
								</TableCell>
								<TableCell>{employee.email}</TableCell>
								<TableCell>{employee.jobTitle || 'N/A'}</TableCell>
								<TableCell>{employee.department || 'N/A'}</TableCell>
								<TableCell>
									<Badge variant="secondary">
										{employee.status === 'active' ? 'Active' : 'Inactive'}
									</Badge>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>

				<div className="flex justify-between items-center mt-4">
					<Button
						variant="outline"
						onClick={() => handlePageChange('prev')}
						disabled={currentPage === 1}
					>
						<TbChevronLeft className="h-4 w-4" />
						Previous
					</Button>
					<span className="text-sm text-muted-foreground">
						Page {currentPage} of {totalPages}
					</span>
					<Button
						variant="outline"
						onClick={() => handlePageChange('next')}
						disabled={currentPage === totalPages}
					>
						Next
						<TbChevronRight className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</AppBody>
	);
}
