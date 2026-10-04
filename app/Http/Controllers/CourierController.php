<?php

namespace App\Http\Controllers;

use App\Models\Courier;
use App\Http\Requests\StoreCourierRequest;
use App\Http\Requests\UpdateCourierRequest;
use Inertia\Inertia;

class CourierController extends Controller
{
    public function index()
    {
        return Inertia::render('Couriers/Index', [
            'title' => 'Couriers',
            'couriers' => Courier::withCount('parcels')->orderBy('name')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Couriers/Create', ['title' => 'Add Courier']);
    }

    public function store(StoreCourierRequest $request)
    {
        $courier = Courier::create($request->validated());

        if ($request->wantsJson()) {
            return response()->json($courier, 201);
        }

        return redirect()->route('couriers.index')->with('success', 'Courier added.');
    }

    public function show(Courier $courier)
    {
        return Inertia::render('Couriers/Show', [
            'title' => 'Courier Details',
            'courier' => $courier->load('parcels'),
        ]);
    }

    public function edit(Courier $courier)
    {
        return Inertia::render('Couriers/Edit', [
            'title' => 'Edit Courier',
            'courier' => $courier,
        ]);
    }

    public function update(UpdateCourierRequest $request, Courier $courier)
    {
        $courier->update($request->validated());

        return redirect()->route('couriers.index')->with('success', 'Courier updated.');
    }

    public function destroy(Courier $courier)
    {
        $courier->delete();

        return redirect()->route('couriers.index')->with('success', 'Courier removed.');
    }
}