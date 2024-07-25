<?php

namespace App\Http\Controllers;

use App\Models\FoundItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class FoundItemController extends Controller
{
    /**
     * Store a newly created found item in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'picture' => 'nullable|image|max:1999', // Accepts only images less than 2MB
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $path = $request->file('picture')->store('found_items', 'public');
   $foundItem = FoundItem::create([
            'user_id' => Auth::id(),
            'title' => $request->title,
            'description' => $request->description,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'picture' => $path,
        ]);
        return response()->json([
            'message' => 'Found item successfully posted.',
            'foundItem' => $foundItem
        ], 201);
    }

    /**
     * Display a listing of the found items.
     */
    public function index()
    {
        $foundItems = FoundItem::with('user')->get();
        return response()->json($foundItems);
    }

    /**
     * Display the specified found item.
     */
    public function show($id)
    {
        $foundItem = FoundItem::with('user')->findOrFail($id);
        return response()->json($foundItem);
    }
    public function update(Request $request, $id)
    {
        $foundItem = FoundItem::findOrFail($id);

        // Check if the authenticated user is the one who posted the item
        if ($foundItem->user_id !== Auth::id()) {
            return response()->json(['error' => 'You do not have permission to update this item.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'latitude' => 'sometimes|required|numeric|between:-90,90',
            'longitude' => 'sometimes|required|numeric|between:-180,180',
            'picture' => 'nullable|image|max:1999', // Accepts only images less than 2MB
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        if ($request->hasFile('picture')) {
            $path = $request->file('picture')->store('found_items', 'public');
            $foundItem->picture = $path;
        }

        $foundItem->title = $request->input('title', $foundItem->title);
        $foundItem->description = $request->input('description', $foundItem->description);
        $foundItem->latitude = $request->input('latitude', $foundItem->latitude);
        $foundItem->longitude = $request->input('longitude', $foundItem->longitude);

        $foundItem->save();

        return response()->json([
            'message' => 'Found item successfully updated.',
            'foundItem' => $foundItem
        ]);
    }
 public function myLostItems()
    {
        $user = Auth::user();
        $myItems = FoundItem::where('user_id', $user->id)->get();

        return response()->json($myItems);
    }

      public function deleteClaim($id)
    {
        $foundItem = FoundItem::findOrFail($id);

        // Check if the authenticated user is the one who issued the claim
        if ($foundItem->user_id !== Auth::id()) {
            return response()->json(['error' => 'You do not have permission to delete this claim.'], 403);
        }

        $foundItem->delete();

        return response()->json(['message' => 'Claim deleted successfully.']);
    }
}
