from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Characters, Scenes, Options
from .models import InfoCard

admin.site.register(Characters)
admin.site.register(Scenes)
admin.site.register(Options)
admin.site.register(InfoCard)
