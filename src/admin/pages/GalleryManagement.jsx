import { useEffect, useState } from "react";
import {
  Pencil,
  Plus,
  Save,
  Trash2,
  Upload,
  Image as ImageIcon,
  X,
  Link,
} from "lucide-react";
import { isSupabaseConfigured, supabase } from "../../lib/supabase";

const emptyTopic = {
  title: "",
  description: "",
  display_order: 0,
  is_published: true,
};

const inputClass =
  "mt-1 w-full border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100";

export default function GalleryManagement() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTopicId, setEditingTopicId] = useState(null);
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [topicForm, setTopicForm] = useState(emptyTopic);
  const [newImages, setNewImages] = useState([]);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const load = async () => {
    const { data, error } = await supabase
      .from("gallery_topics")
      .select(
        "*, gallery(id, image_url, image_alt, display_order, is_published)",
      )
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) setMessage(error.message);
    // Sort gallery images within each topic by display_order
    const sortedTopics = (data || []).map((topic) => ({
      ...topic,
      gallery: (topic.gallery || []).sort(
        (a, b) => a.display_order - b.display_order,
      ),
    }));
    setTopics(sortedTopics);
    setLoading(false);
  };

  useEffect(() => {
    if (isSupabaseConfigured) load();
  }, []);

  const resetTopicForm = () => {
    setEditingTopicId(null);
    // Calculate next display order as max existing + 1, or 0 if no topics
    const maxDisplayOrder =
      topics.length > 0
        ? Math.max(...topics.map((t) => t.display_order || 0))
        : 0;
    setTopicForm({ ...emptyTopic, display_order: maxDisplayOrder + 1 });
    setNewImages([]);
    setImageUrlInput("");
    setSelectedTopicId(null);
    setMessage("");
  };

  const startEditTopic = (topic) => {
    setEditingTopicId(topic.id);
    setTopicForm({
      title: topic.title,
      description: topic.description || "",
      display_order: topic.display_order ?? 0,
      is_published: topic.is_published,
    });
    setSelectedTopicId(topic.id);
    // Pre-load existing images into newImages so they can be viewed and managed
    setNewImages(
      (topic.gallery || []).map((img) => ({
        image_url: img.image_url,
        image_alt: img.image_alt || "",
        id: img.id, // Track existing image IDs
        isExisting: true,
      })),
    );
    setImageUrlInput("");
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const uploadPhotos = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const oversized = files.find((f) => f.size > 5 * 1024 * 1024);
    if (oversized) {
      setMessage("All photos must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }

    setSaving(true);
    setMessage("");

    const uploadPromises = files.map(async (file) => {
      const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
      const path = `gallery/${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${safeName}`;
      const { error } = await supabase.storage
        .from("site-media")
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (error) throw error;
      const { data } = supabase.storage.from("site-media").getPublicUrl(path);
      return data.publicUrl;
    });

    try {
      const urls = await Promise.all(uploadPromises);
      setNewImages((prev) => [
        ...prev,
        ...urls.map((url) => ({ image_url: url, image_alt: "" })),
      ]);
      setMessage(
        `${urls.length} photo(s) uploaded. Save the topic to apply them.`,
      );
    } catch (error) {
      setMessage(error.message);
    }

    setSaving(false);
    event.target.value = "";
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addImageUrl = () => {
    const url = imageUrlInput.trim();
    if (!url) return;
    setNewImages((prev) => [...prev, { image_url: url, image_alt: "" }]);
    setImageUrlInput("");
    setMessage("Image URL added. Save the topic to apply it.");
  };

  const saveTopic = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    const topicPayload = {
      title: topicForm.title.trim(),
      description: topicForm.description.trim(),
      display_order: Number(topicForm.display_order) || 0,
      is_published: topicForm.is_published,
    };

    let topicId = editingTopicId;

    // Save or update topic
    if (editingTopicId) {
      const { error } = await supabase
        .from("gallery_topics")
        .update(topicPayload)
        .eq("id", editingTopicId);
      if (error) {
        setSaving(false);
        return setMessage(error.message);
      }
    } else {
      const { data, error } = await supabase
        .from("gallery_topics")
        .insert(topicPayload)
        .select()
        .single();
      if (error) {
        setSaving(false);
        return setMessage(error.message);
      }
      topicId = data.id;
    }

    // Handle images: separate existing from new
    const existingImages = newImages.filter((img) => img.isExisting);
    const newImagesToAdd = newImages.filter((img) => !img.isExisting);

    // Get current max display_order for this topic from database
    let maxDisplayOrder = 0;
    if (editingTopicId) {
      const { data: topicImages } = await supabase
        .from("gallery")
        .select("display_order")
        .eq("topic_id", editingTopicId);
      if (topicImages && topicImages.length > 0) {
        maxDisplayOrder = Math.max(
          ...topicImages.map((img) => img.display_order || 0),
        );
      }
    }

    // Add new images only
    if (newImagesToAdd.length > 0) {
      const imagePayload = newImagesToAdd.map((img, index) => ({
        topic_id: topicId,
        image_url: img.image_url,
        image_alt: img.image_alt,
        display_order: maxDisplayOrder + 1 + index,
        is_published: true,
      }));
      const { error } = await supabase.from("gallery").insert(imagePayload);
      if (error) {
        setSaving(false);
        return setMessage(error.message);
      }
    }

    // Remove images that were deleted from the list (if editing)
    if (editingTopicId) {
      const currentTopic = topics.find((t) => t.id === editingTopicId);
      if (currentTopic && currentTopic.gallery) {
        const existingIds = currentTopic.gallery.map((g) => g.id);
        const keptIds = existingImages.map((img) => img.id);
        const idsToRemove = existingIds.filter((id) => !keptIds.includes(id));

        if (idsToRemove.length > 0) {
          // Only delete from database, not from storage
          const { error } = await supabase
            .from("gallery")
            .delete()
            .in("id", idsToRemove);
          if (error) {
            setSaving(false);
            return setMessage(error.message);
          }
        }
      }
    }

    // Copy title and description to all images in the topic
    const { error: updateError } = await supabase
      .from("gallery")
      .update({
        title: topicPayload.title,
        description: topicPayload.description,
      })
      .eq("topic_id", topicId);

    if (updateError) {
      setSaving(false);
      return setMessage(updateError.message);
    }

    // Recalculate display_order for all images across all topics
    // Get all topics sorted by display_order
    const { data: allTopics } = await supabase
      .from("gallery_topics")
      .select("id, display_order")
      .order("display_order", { ascending: true });

    if (allTopics) {
      let globalOrder = 0;
      for (const topic of allTopics) {
        // Get all images for this topic
        const { data: topicImages } = await supabase
          .from("gallery")
          .select("id")
          .eq("topic_id", topic.id)
          .order("display_order", { ascending: true });

        if (topicImages) {
          // Update each image with the global display order
          for (let i = 0; i < topicImages.length; i++) {
            await supabase
              .from("gallery")
              .update({ display_order: globalOrder + i })
              .eq("id", topicImages[i].id);
          }
          globalOrder += topicImages.length;
        }
      }
    }

    setMessage(editingTopicId ? "Topic updated." : "Topic added with images.");
    resetTopicForm();
    load();
    setSaving(false);
  };

  const removeTopicImage = async (imageId) => {
    if (!window.confirm("Remove this image from the topic?")) return;
    setSaving(true);
    const { error } = await supabase.from("gallery").delete().eq("id", imageId);
    setSaving(false);
    setMessage(error ? error.message : "Image removed.");
    if (!error) load();
  };

  const removeTopic = async (topic) => {
    if (!window.confirm(`Remove topic "${topic.title}" and all its images?`))
      return;
    setSaving(true);
    const { error } = await supabase
      .from("gallery_topics")
      .delete()
      .eq("id", topic.id);
    setSaving(false);
    setMessage(error ? error.message : "Topic removed.");
    if (!error) load();
  };

  if (loading)
    return <div className="py-12 text-slate-500">Loading gallery...</div>;

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-slate-950">
          Gallery Management
        </h1>
        <p className="mt-2 text-slate-600">
          Create topics with titles and descriptions, then upload multiple
          images to each topic.
        </p>
      </header>

      <div className="grid gap-6 xl:grid-cols-[minmax(20rem,28rem)_1fr]">
        <form
          onSubmit={saveTopic}
          className="h-fit border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        >
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-black text-slate-950">
              {editingTopicId ? "Edit topic" : "Add topic"}
            </h2>
            {editingTopicId && (
              <button
                type="button"
                onClick={resetTopicForm}
                className="text-sm font-bold text-emerald-800 hover:underline"
              >
                Add new
              </button>
            )}
          </div>
          <label className="mt-5 block text-sm font-bold text-slate-700">
            Topic Title
            <input
              className={inputClass}
              required
              minLength="2"
              maxLength="200"
              value={topicForm.title}
              onChange={(e) =>
                setTopicForm({ ...topicForm, title: e.target.value })
              }
            />
          </label>
          <label className="mt-4 block text-sm font-bold text-slate-700">
            Description
            <textarea
              className={inputClass}
              rows="3"
              maxLength="500"
              value={topicForm.description}
              onChange={(e) =>
                setTopicForm({ ...topicForm, description: e.target.value })
              }
            />
          </label>

          <div className="mt-5">
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Upload Images
            </label>
            <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 bg-slate-950 px-4 text-sm font-bold text-white hover:bg-slate-800">
              <Upload className="h-4 w-4" />
              Upload Photos
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="sr-only"
                disabled={saving}
                onChange={uploadPhotos}
              />
            </label>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              JPG, PNG, or WebP. Maximum 5 MB each. Multiple files allowed.
            </p>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Add Image URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                className={inputClass}
                placeholder="https://example.com/image.jpg"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                disabled={saving}
              />
              <button
                type="button"
                onClick={addImageUrl}
                disabled={saving || !imageUrlInput.trim()}
                className="px-4 py-2 bg-slate-950 text-white text-sm font-bold rounded hover:bg-slate-800 disabled:opacity-60"
              >
                <Link className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Or add images by URL instead of uploading.
            </p>
          </div>

          {/* New Images Preview */}
          {newImages.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-2">
              {newImages.map((img, index) => (
                <div
                  key={index}
                  className="relative aspect-square overflow-hidden bg-slate-100 rounded"
                >
                  <img
                    src={img.image_url}
                    alt=""
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextElementSibling.style.display = "flex";
                    }}
                  />
                  <div className="hidden absolute inset-0 items-center justify-center bg-slate-100">
                    <ImageIcon className="h-8 w-8 text-slate-400" />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="absolute top-1 right-1 rounded-full bg-red-600 p-1 text-white hover:bg-red-700 z-10"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <label className="mt-4 block text-sm font-bold text-slate-700">
            Display order
            <input
              className={inputClass}
              type="number"
              min="0"
              value={topicForm.display_order}
              onChange={(e) =>
                setTopicForm({ ...topicForm, display_order: e.target.value })
              }
            />
          </label>
          <label className="mt-5 flex items-center gap-3 text-sm font-bold text-slate-700">
            <input
              type="checkbox"
              checked={topicForm.is_published}
              onChange={(e) =>
                setTopicForm({ ...topicForm, is_published: e.target.checked })
              }
              className="h-5 w-5 accent-emerald-800"
            />
            Show on public website
          </label>
          {message && (
            <p
              role="status"
              className="mt-4 bg-slate-100 p-3 text-sm font-semibold text-slate-700"
            >
              {message}
            </p>
          )}
          <button
            disabled={saving}
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-emerald-800 px-5 font-bold text-white hover:bg-emerald-900 disabled:opacity-60"
          >
            {editingTopicId ? (
              <Save className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {saving
              ? "Saving..."
              : editingTopicId
                ? "Save changes"
                : "Add topic"}
          </button>
        </form>

        <section className="border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-950">
                Current Topics
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Published topics and their images appear on the website.
              </p>
            </div>
            <span className="text-sm font-bold text-slate-500">
              {topics.length} topics
            </span>
          </div>
          <div className="mt-6 space-y-6">
            {topics.map((topic) => (
              <article
                key={topic.id}
                className="border border-slate-200 rounded-lg overflow-hidden"
              >
                <div className="p-4 border-b border-slate-200 bg-slate-50">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-black text-slate-950">
                        {topic.title}
                      </h3>
                      {topic.description && (
                        <p className="mt-1 text-sm text-slate-600 line-clamp-2">
                          {topic.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`px-2 py-1 text-[11px] font-bold uppercase ${topic.is_published ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"}`}
                      >
                        {topic.is_published ? "Live" : "Draft"}
                      </span>
                      <button
                        type="button"
                        onClick={() => startEditTopic(topic)}
                        className="p-2 rounded hover:bg-slate-200 text-slate-700"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeTopic(topic)}
                        disabled={saving}
                        className="p-2 rounded hover:bg-red-50 text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                    {topic.gallery && topic.gallery.length > 0 ? (
                      topic.gallery.map((image) => (
                        <div
                          key={image.id}
                          className="relative aspect-square overflow-hidden bg-slate-100 rounded group"
                        >
                          <img
                            src={image.image_url}
                            alt={image.image_alt || ""}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute bottom-1 left-1 bg-black/50 text-white text-[10px] px-1 rounded">
                            {image.display_order}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeTopicImage(image.id)}
                            disabled={saving}
                            className="absolute top-1 right-1 rounded-full bg-red-600 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full border-2 border-dashed border-slate-300 p-4 text-center rounded">
                        <ImageIcon className="mx-auto h-6 w-6 text-slate-400" />
                        <p className="mt-2 text-xs text-slate-500">
                          No images yet
                        </p>
                      </div>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    {topic.gallery?.length || 0} image(s)
                  </p>
                </div>
              </article>
            ))}
            {!topics.length && (
              <div className="border border-dashed border-slate-300 p-10 text-center">
                <ImageIcon className="mx-auto h-9 w-9 text-slate-400" />
                <p className="mt-4 font-bold text-slate-700">
                  No gallery topics yet
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Create the first topic with the form.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
