from django.db import models

class Characters(models.Model):
    name = models.CharField(max_length=100)
    age = models.CharField(max_length=50)
    location = models.CharField(max_length=100)

    class Meta:
        db_table = 'Characters'  # still works in SQLite

    def __str__(self):
        return self.name


class Scenes(models.Model):
    character = models.ForeignKey(Characters, on_delete=models.CASCADE)
    scene_key = models.CharField(max_length=50)
    question = models.TextField()

    class Meta:
        db_table = 'Scenes'
        unique_together = ('character', 'scene_key')  # helpful in SQLite to avoid duplicates

    def __str__(self):
        return f"{self.scene_key} - {self.character.name}"


class Options(models.Model):
    scene = models.ForeignKey(Scenes, on_delete=models.CASCADE)
    text = models.TextField()
    feedback = models.TextField()
    emotion = models.CharField(max_length=50)
    correct = models.BooleanField()

    class Meta:
        db_table = 'Options'
    def __str__(self):
        return f"{self.scene.scene_key} - {self.text[:40]}{'...' if len(self.text) > 40 else ''}"

class InfoCard(models.Model):
    title = models.CharField(max_length=255)
    summary = models.TextField()
    full_text = models.TextField(blank=True)
    source_name = models.CharField(max_length=255)
    source_url = models.URLField()

    # Personalisation fields
    trimester = models.CharField(max_length=20, choices=[("1", "Trimester 1"), ("2", "Trimester 2"), ("3", "Trimester 3")])
    age_group = models.CharField(max_length=50)  # e.g., '20–25', '26–30'
    heat_sensitive = models.BooleanField(default=False)
    pollution_sensitive = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'InfoCard'

    def __str__(self):
        return self.title
