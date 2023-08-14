<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\CategoryRequest;
use App\Http\Resources\CategoryCollection;
use App\Http\Resources\CategoryResource;

class CategoryController extends Controller
{
    /**
     * Create the controller instance.
     */
    public function __construct()
    {
        $this->authorizeResource(Category::class, 'category');
    }

    public function index(Request $request): JsonResponse
    {
        $categories = Category::all();

        if ($request->globalFilter != null) {
            $categories = Category::where('name', 'like', "%$request->globalFilter%")->get();
        }

        if ($request->sortField != null && $request->sortOrder != null) {
            $request->sortOrder == 1 ?
                $categories = $categories->sortBy($request->sortField) :
                $categories = $categories->sortByDesc($request->sortField);
        }

        $total = $categories->count();

        if ($request->first != null && $request->rows != null) {
            $categories = $categories->skip($request->first)->take($request->rows)->values();
        }

        return response()->json(new CategoryCollection($categories, $total));
    }

    public function show(Category $category): JsonResponse
    {
        return response()->json(new CategoryResource($category));
    }

    public function store(CategoryRequest $request): JsonResponse
    {
        $category = Category::create($request->all());

        return response()->json([
            'message' => "Pomyślnie dodano kategorię $category->name.",
            'data' => $category,
        ], 201);
    }

    public function update(CategoryRequest $request, Category $category): JsonResponse
    {
        $category->update($request->all());

        return response()->json([
            'message' => "Pomyślnie zaktualizowano kategorię $category->name.",
            'data' => $category,
        ]);
    }

    public function destroy(Category $category): JsonResponse
    {
        if (!$category->equipment->isEmpty()) {
            return response()->json([
                'message' => "Nie można usuniąć kategorii $category->name ponieważ ma przypisane sprzęty."
            ], 409);
        }
        $category->delete();

        return response()->json([
            'message' => "Pomyślnie usunięto kategorię $category->name."
        ]);
    }

    public function search(Request $request): Response
    {
        $category = Category::where($request->attr, $request->val)->get();

        return $category->isEmpty() ? response(false) : response(true);
    }
}
