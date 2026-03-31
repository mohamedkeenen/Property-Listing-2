"use client";

import { useState } from "react";
import { 
  Building2, 
  Plus, 
  Trash2,
  LayoutGrid,
  Search,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  useGetProjectsQuery, 
  useAddProjectMutation, 
  useDeleteProjectMutation,
  useGetDevelopersQuery,
  useAddDeveloperMutation,
  useDeleteDeveloperMutation
} from "@/api/redux/services/settingsApi";
import { toast } from "react-hot-toast";

interface InputsTabProps {
  isAdmin: boolean;
}

export function InputsTab({ isAdmin }: InputsTabProps) {
  const { data: projectsData, isLoading: isLoadingProjects } = useGetProjectsQuery();
  const { data: developersData, isLoading: isLoadingDevelopers } = useGetDevelopersQuery();
  
  const [addProject, { isLoading: isAddingProject }] = useAddProjectMutation();
  const [deleteProject] = useDeleteProjectMutation();
  const [addDeveloper, { isLoading: isAddingDeveloper }] = useAddDeveloperMutation();
  const [deleteDeveloper] = useDeleteDeveloperMutation();

  const developers = developersData?.data || [];
  const projectNames = projectsData?.data || [];
  
  const [newDeveloper, setNewDeveloper] = useState("");
  const [newProject, setNewProject] = useState("");
  
  const [devSearch, setDevSearch] = useState("");
  const [projectSearch, setProjectSearch] = useState("");

  const handleAddDeveloper = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeveloper.trim()) return;
    if (developers.some((d: any) => d.name.toLowerCase() === newDeveloper.trim().toLowerCase())) {
      toast.error("Developer already exists");
      return;
    }
    try {
      await addDeveloper({ name: newDeveloper.trim() }).unwrap();
      setNewDeveloper("");
      toast.success("Developer added");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add developer");
    }
  };

  const handleDeleteDeveloper = async (id: string | number) => {
    try {
      await deleteDeveloper(id).unwrap();
      toast.success("Developer removed");
    } catch (err: any) {
      toast.error("Failed to remove developer");
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.trim()) return;
    if (projectNames.some((p: any) => p.name.toLowerCase() === newProject.trim().toLowerCase())) {
      toast.error("Project already exists");
      return;
    }
    try {
      await addProject({ name: newProject.trim() }).unwrap();
      setNewProject("");
      toast.success("Project added");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add project");
    }
  };

  const handleDeleteProject = async (id: string | number) => {
    try {
      await deleteProject(id).unwrap();
      toast.success("Project removed");
    } catch (err: any) {
      toast.error("Failed to remove project");
    }
  };

  const filteredDevs = developers.filter((d: any) => d.name.toLowerCase().includes(devSearch.toLowerCase()));
  const filteredProjects = projectNames.filter((p: any) => p.name.toLowerCase().includes(projectSearch.toLowerCase()));

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* Developers Section */}
      <Card className="rounded-2xl border-border/50 shadow-xl overflow-hidden backdrop-blur-sm bg-card/50 h-full flex flex-col">
        <CardHeader className="border-b border-border/10 bg-muted/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="font-black text-xl">Developers</CardTitle>
              <CardDescription className="font-medium">Manage the list of property developers.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6 flex-1 flex flex-col">
          <form onSubmit={handleAddDeveloper} className="flex gap-2">
            <div className="relative flex-1">
              <Input
                placeholder="Add new developer..."
                value={newDeveloper}
                onChange={(e) => setNewDeveloper(e.target.value)}
                className="rounded-xl border-border/50 bg-background/50 h-11 pl-4"
                disabled={!isAdmin || isAddingDeveloper}
              />
            </div>
            <Button 
              type="submit" 
              className="rounded-xl h-11 px-4 bg-primary hover:bg-primary/90 text-white font-bold transition-all active:scale-95"
              disabled={!isAdmin || !newDeveloper.trim() || isAddingDeveloper}
            >
              {isAddingDeveloper ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-1" />}
              Add
            </Button>
          </form>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search developers..."
              value={devSearch}
              onChange={(e) => setDevSearch(e.target.value)}
              className="rounded-xl border-none bg-muted/30 h-10 pl-10 text-sm"
              disabled={isLoadingDevelopers}
            />
          </div>

          <div className="flex-1 overflow-y-auto max-h-[400px] pr-2 space-y-2 custom-scrollbar border-t border-border/10 pt-4">
            {isLoadingDevelopers ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
            ) : filteredDevs.length > 0 ? (
              filteredDevs.map((dev: any) => (
                <div 
                  key={dev.id} 
                  className="group flex items-center justify-between p-3 rounded-xl bg-background/40 border border-border/30 hover:border-primary/30 hover:bg-primary/5 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-4 w-4 text-primary/50 group-hover:text-primary transition-colors" />
                    <span className="font-bold text-sm text-foreground/80">{dev.name}</span>
                  </div>
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteDeveloper(dev.id)}
                      className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-border/50 bg-muted/20">
                <Building2 className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-sm font-bold text-muted-foreground">No developers found</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Add your first developer above.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Projects Section */}
      <Card className="rounded-2xl border-border/50 shadow-xl overflow-hidden backdrop-blur-sm bg-card/50 h-full flex flex-col">
        <CardHeader className="border-b border-border/10 bg-muted/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <LayoutGrid className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="font-black text-xl">Project Names</CardTitle>
              <CardDescription className="font-medium">Manage the list of project names.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6 flex-1 flex flex-col">
          <form onSubmit={handleAddProject} className="flex gap-2">
            <div className="relative flex-1">
              <Input
                placeholder="Add new project..."
                value={newProject}
                onChange={(e) => setNewProject(e.target.value)}
                className="rounded-xl border-border/50 bg-background/50 h-11 pl-4"
                disabled={!isAdmin || isAddingProject}
              />
            </div>
            <Button 
              type="submit" 
              className="rounded-xl h-11 px-4 bg-primary hover:bg-primary/90 text-white font-bold transition-all active:scale-95"
              disabled={!isAdmin || !newProject.trim() || isAddingProject}
            >
              {isAddingProject ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-1" />}
              Add
            </Button>
          </form>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={projectSearch}
              onChange={(e) => setProjectSearch(e.target.value)}
              className="rounded-xl border-none bg-muted/30 h-10 pl-10 text-sm"
              disabled={isLoadingProjects}
            />
          </div>

          <div className="flex-1 overflow-y-auto max-h-[400px] pr-2 space-y-2 custom-scrollbar border-t border-border/10 pt-4">
            {isLoadingProjects ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
            ) : filteredProjects.length > 0 ? (
              filteredProjects.map((proj: any) => (
                <div 
                  key={proj.id} 
                  className="group flex items-center justify-between p-3 rounded-xl bg-background/40 border border-border/30 hover:border-primary/30 hover:bg-primary/5 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-4 w-4 text-primary/50 group-hover:text-primary transition-colors" />
                    <span className="font-bold text-sm text-foreground/80">{proj.name}</span>
                  </div>
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteProject(proj.id)}
                      className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-border/50 bg-muted/20">
                <LayoutGrid className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-sm font-bold text-muted-foreground">No projects found</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Add your first project above.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
